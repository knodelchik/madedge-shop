// app/api/create-payment/route.ts
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
    const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json', { next: { revalidate: 3600 } });
    const data = await res.json();
    return data[0]?.rate || 42.0; // Фолбек курс, якщо API не відповідає
  } catch (e) {
    console.error('Failed to fetch exchange rate:', e);
    return 42.0;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ми більше не довіряємо amountUSD/amountUAH від клієнта!
    const { items, shippingAddress, shippingType, method } = body;

    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }

    // --- 🛡️ 1. SECURITY CALCULATION START ---
    
    // А. Перевіряємо товари та ціни в БД
    const itemIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, price, title, images, stock')
      .in('id', itemIds);

    if (prodError || !dbProducts) throw new Error("Помилка перевірки товарів");

    let calculatedTotalUSD = 0;
    const orderItemsData = [];

    for (const clientItem of items) {
      const dbProduct = dbProducts.find((p) => p.id === clientItem.id);
      
      if (!dbProduct) throw new Error(`Товар "${clientItem.title}" не знайдено або ціна змінилась`);
      // Перевірка залишків (опціонально, але бажано)
      // if (dbProduct.stock < clientItem.quantity) throw new Error(`Товару "${dbProduct.title}" недостатньо на складі`);

      const itemTotal = Number(dbProduct.price) * Number(clientItem.quantity);
      calculatedTotalUSD += itemTotal;

      orderItemsData.push({
        product_id: dbProduct.id,
        product_title: dbProduct.title,
        quantity: clientItem.quantity,
        price: dbProduct.price, // Беремо ціну з БАЗИ, а не з запиту
        image_url: dbProduct.images?.[0] || ''
      });
    }

    // Б. Рахуємо доставку на сервері
    const { data: deliverySettings } = await supabaseAdmin.from('delivery_settings').select('*');
    let shippingCost = 0;
    
    if (deliverySettings) {
      const countryCode = shippingAddress.country_code;
      // Шукаємо налаштування для країни або беремо ROW (Rest of World)
      const setting = deliverySettings.find(s => s.country_code === countryCode) || deliverySettings.find(s => s.country_code === 'ROW');
      
      if (setting) {
        shippingCost = shippingType === 'Express' ? Number(setting.express_price) : Number(setting.standard_price);
      }
    }

    const finalAmountUSD = calculatedTotalUSD + shippingCost;
    // --- 🛡️ SECURITY CALCULATION END ---


    // 2. Створюємо замовлення в БД
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = shippingAddress.user_id;

    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: finalAmountUSD, // Тільки розрахована сума
      status: 'pending',
      payment_method: method,
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) throw new Error(`Supabase DB Error: ${dbError.message}`);

    // 3. Зберігаємо товари
    const itemsToInsert = orderItemsData.map(item => ({ ...item, order_id: uniqueOrderId }));
    await supabaseAdmin.from('order_items').insert(itemsToInsert);


    // === PAYPAL ЛОГІКА ===
    if (method === 'paypal') {
      try {
        const accessToken = await generateAccessToken();
        const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
        
        const payload = {
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: uniqueOrderId,
              amount: {
                currency_code: "USD",
                value: finalAmountUSD.toFixed(2), // Використовуємо захищену суму
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                brand_name: "MadEdge Shop",
                user_action: "PAY_NOW",
                return_url: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
                cancel_url: `${BASE_URL}/order?status=cancelled`,
              },
            },
          },
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const orderData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(orderData));
        }

        return NextResponse.json({ id: orderData.id, internalOrderId: uniqueOrderId });

      } catch (paypalError: any) {
        console.error('PayPal API Error:', paypalError);
        return NextResponse.json({ error: 'PayPal creation failed', details: paypalError.message }, { status: 500 });
      }
    }

    // === MONOBANK ===
    else {
      // Конвертуємо USD в UAH на сервері
      const rate = await getExchangeRate();
      const amountUAH = finalAmountUSD * rate;
      const amountInCents = Math.round(amountUAH * 100);
      
      const productsNames = orderItemsData.map(i => `${i.product_title} x${i.quantity}`).join(', ').substring(0, 250);
      
      const invoiceData = await createMonoInvoice({
        order_id: uniqueOrderId,
        amount: amountInCents,
        ccy: 980, // UAH
        redirectUrl: `${BASE_URL}/order/result?source=monobank&orderId=${uniqueOrderId}`,
        webHookUrl: `${BASE_URL}/api/payment-webhook?secret=${process.env.MONOBANK_WEBHOOK_SECRET}`,
        productName: productsNames || 'Payment for order',
      });

      return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }

  } catch (error: any) {
    console.error('Create Payment Global Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}