import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMonoInvoice } from '../../lib/monobank';
import { generateAccessToken, PAYPAL_API_BASE } from '../../lib/paypal';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Функція для отримання курсу USD -> UAH (НБУ)
async function getExchangeRate() {
  try {
    const res = await fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json',
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data[0]?.rate || 42.0;
  } catch (e) {
    console.error('Failed to fetch exchange rate:', e);
    return 42.0;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingAddress, shippingType, method } = body;

    // Валідація
    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }

    // --- 1. ПЕРЕВІРКА ЦІН І ЗАЛИШКІВ ---
    const itemIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, price, title, images, stock')
      .in('id', itemIds);

    if (prodError || !dbProducts) throw new Error('Помилка перевірки товарів');

    let calculatedTotalUSD = 0;
    const orderItemsData = [];

    for (const clientItem of items) {
      const dbProduct = dbProducts.find((p) => p.id === clientItem.id);
      if (!dbProduct)
        throw new Error(`Товар "${clientItem.title}" не знайдено`);

      const itemTotal = Number(dbProduct.price) * Number(clientItem.quantity);
      calculatedTotalUSD += itemTotal;

      orderItemsData.push({
        product_id: dbProduct.id,
        product_title: dbProduct.title,
        quantity: clientItem.quantity,
        price: dbProduct.price,
        image_url: dbProduct.images?.[0] || '',
      });
    }

    // Розрахунок доставки
    const { data: deliverySettings } = await supabaseAdmin
      .from('delivery_settings')
      .select('*');
    let shippingCost = 0;
    if (deliverySettings) {
      const countryCode = shippingAddress.country_code;
      const setting =
        deliverySettings.find((s) => s.country_code === countryCode) ||
        deliverySettings.find((s) => s.country_code === 'ROW');
      if (setting) {
        shippingCost =
          shippingType === 'Express'
            ? Number(setting.express_price)
            : Number(setting.standard_price);
      }
    }

    const finalAmountUSD = calculatedTotalUSD + shippingCost;

    // --- 2. СТВОРЕННЯ ЗАМОВЛЕННЯ В БД ---
    const uniqueOrderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const userId = shippingAddress.user_id;

    // Визначаємо метод для запису в БД
    // Якщо прийшло 'monobank' або 'fondy' (старий код) -> пишемо 'monobank'
    // Якщо 'paypal' -> 'paypal'
    let methodForDb = method;
    if (method === 'fondy') methodForDb = 'monobank';

    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: finalAmountUSD,
      status: 'pending',
      payment_method: methodForDb, // <--- ОСЬ ТУТ ТЕПЕР БУДЕ ПИСАТИ 'monobank' В АДМІНЦІ
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType,
    });

    if (dbError) throw new Error(`Supabase DB Error: ${dbError.message}`);

    const itemsToInsert = orderItemsData.map((item) => ({
      ...item,
      order_id: uniqueOrderId,
    }));
    await supabaseAdmin.from('order_items').insert(itemsToInsert);

    // --- 3. ОБРОБКА ПЛАТІЖНОЇ СИСТЕМИ ---

    // === PAYPAL ===
    if (method === 'paypal') {
      const accessToken = await generateAccessToken();
      const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: uniqueOrderId,
            amount: { currency_code: 'USD', value: finalAmountUSD.toFixed(2) },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'MadEdge Shop',
              user_action: 'PAY_NOW',
              // PayPal повертає клієнта на ФРОНТЕНД, тому payment-return не потрібен
              return_url: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
              cancel_url: `${BASE_URL}/order?status=cancelled`,
            },
          },
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(orderData));

      return NextResponse.json({
        id: orderData.id,
        internalOrderId: uniqueOrderId,
      });
    }

    // === MONOBANK ===
    // Обробляємо і 'monobank', і 'fondy' (на випадок старого кешу) як Mono
    else {
      const rate = await getExchangeRate();
      const amountUAH = finalAmountUSD * rate;
      const amountInCents = Math.round(amountUAH * 100);

      const productsNames = orderItemsData
        .map((i) => `${i.product_title} x${i.quantity}`)
        .join(', ')
        .substring(0, 250);

      const invoiceData = await createMonoInvoice({
        order_id: uniqueOrderId,
        amount: amountInCents,
        ccy: 980,
        // Mono повертає клієнта на ФРОНТЕНД
        redirectUrl: `${BASE_URL}/order/result?source=monobank&orderId=${uniqueOrderId}`,
        webHookUrl: `${BASE_URL}/api/payment-webhook?secret=${process.env.MONOBANK_WEBHOOK_SECRET}`,
        productName: productsNames || 'Payment for order',
      });

      return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }
  } catch (error: any) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
