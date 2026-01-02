import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMonoInvoice } from '../../lib/monobank'; // Переконайтеся, що шлях вірний
import { generateAccessToken, PAYPAL_API_BASE } from '../../lib/paypal'; // Переконайтеся, що шлях вірний

// Ініціалізація Supabase з правами адміна (Service Role)
// Це дозволяє читати ціни та створювати замовлення в обхід RLS
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
      { next: { revalidate: 3600 } } // Кешуємо курс на 1 годину
    );
    const data = await res.json();
    return data[0]?.rate || 42.0; // Фоллбек курс, якщо НБУ не відповідає
  } catch (e) {
    console.error('Failed to fetch exchange rate:', e);
    return 42.0;
  }
}

export async function POST(req: Request) {
  try {
    // 1. Отримуємо ТІЛЬКИ ідентифікатори та вибір користувача
    // Ми ігноруємо будь-які поля `amount`, `price`, `total`, які міг надіслати клієнт
    const body = await req.json();
    const { items, shippingAddress, shippingType, method } = body;

    // Базова валідація
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Кошик порожній' }, { status: 400 });
    }
    if (!shippingAddress) {
      return NextResponse.json({ error: 'Немає адреси доставки' }, { status: 400 });
    }

    // --- КРОК 2: ОТРИМАННЯ ЧЕСНИХ ЦІН З БД ---
    const itemIds = items.map((i: any) => i.id);
    
    const { data: dbProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, price, title, images, stock')
      .in('id', itemIds);

    if (prodError || !dbProducts) {
      console.error('DB Error:', prodError);
      return NextResponse.json({ error: 'Помилка перевірки товарів' }, { status: 500 });
    }

    // --- КРОК 3: РОЗРАХУНОК СУМИ ТОВАРІВ ---
    let calculatedTotalUSD = 0;
    const orderItemsData = [];

    for (const clientItem of items) {
      const dbProduct = dbProducts.find((p) => p.id === clientItem.id);
      
      if (!dbProduct) {
        // Якщо товар не знайдено в базі (видалений або підроблений ID)
        return NextResponse.json({ error: `Товар з ID ${clientItem.id} не знайдено` }, { status: 400 });
      }

      // Тут можна додати перевірку наявності (stock)
      // if (dbProduct.stock < clientItem.quantity) { ... }

      const quantity = Number(clientItem.quantity);
      if (quantity <= 0) continue;

      // Рахуємо суму: Ціна з БД * Кількість
      const itemTotal = Number(dbProduct.price) * quantity;
      calculatedTotalUSD += itemTotal;

      // Підгтовуємо дані для запису в БД (фіксуємо ціну на момент покупки)
      orderItemsData.push({
        product_id: dbProduct.id,
        product_title: dbProduct.title,
        quantity: quantity,
        price: dbProduct.price, // Зберігаємо ціну за одиницю
        image_url: dbProduct.images?.[0] || '',
      });
    }

    // --- КРОК 4: РОЗРАХУНОК ДОСТАВКИ ---
    // Ми не віримо клієнту, а беремо налаштування з БД
    const { data: deliverySettings } = await supabaseAdmin
      .from('delivery_settings')
      .select('*');

    let shippingCost = 0;
    
    if (deliverySettings && deliverySettings.length > 0) {
      const countryCode = shippingAddress.country_code;
      // Шукаємо налаштування для країни або беремо ROW (Rest of World)
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

    // Фінальна сума в доларах (Товари + Доставка)
    const finalAmountUSD = calculatedTotalUSD + shippingCost;

    // --- КРОК 5: СТВОРЕННЯ ЗАМОВЛЕННЯ В БД (STATUS: PENDING) ---
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = shippingAddress.user_id; // Припускаємо, що це прийшло з валідованої сесії або фронтенду

    // Нормалізація методу оплати для історії
    let methodForDb = method;
    if (method === 'fondy') methodForDb = 'monobank'; // Сумісність зі старим кодом

    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: finalAmountUSD, // Записуємо НАШУ розраховану суму
      status: 'pending',
      payment_method: methodForDb,
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType,
    });

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
      throw new Error(`Помилка створення замовлення: ${dbError.message}`);
    }

    // Додаємо товари в order_items
    const itemsToInsert = orderItemsData.map((item) => ({
      ...item,
      order_id: uniqueOrderId,
    }));
    
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsToInsert);
    if (itemsError) {
       console.error('Order Items Error:', itemsError);
       // Тут можна було б видалити замовлення, але статус pending і так не буде оброблений
    }

    // --- КРОК 6: ГЕНЕРАЦІЯ ПЛАТЕЖУ В БАНКУ ---

    // === ВАРІАНТ A: PAYPAL ===
    if (method === 'paypal') {
      const accessToken = await generateAccessToken();
      const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: uniqueOrderId,
            amount: { 
                currency_code: 'USD', 
                value: finalAmountUSD.toFixed(2) // Передаємо розраховану суму
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'MadEdge Shop',
              user_action: 'PAY_NOW',
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
      if (!response.ok) {
        console.error('PayPal Error:', orderData);
        throw new Error('Помилка створення платежу PayPal');
      }

      return NextResponse.json({
        id: orderData.id,
        internalOrderId: uniqueOrderId,
      });
    }

    // === ВАРІАНТ B: MONOBANK ===
    else {
      // Конвертуємо USD в UAH
      const rate = await getExchangeRate();
      const amountUAH = finalAmountUSD * rate;
      const amountInCents = Math.round(amountUAH * 100); // Монобанк приймає копійки

      // Формуємо опис (назви товарів)
      const productsNames = orderItemsData
        .map((i) => `${i.product_title} x${i.quantity}`)
        .join(', ')
        .substring(0, 250); // Обрізаємо, якщо дуже довго

      const invoiceData = await createMonoInvoice({
        order_id: uniqueOrderId,
        amount: amountInCents, // Розрахована сума в копійках
        ccy: 980, // UAH
        redirectUrl: `${BASE_URL}/order/result?source=monobank&orderId=${uniqueOrderId}`,
        webHookUrl: `${BASE_URL}/api/payment-webhook?secret=${process.env.MONOBANK_WEBHOOK_SECRET}`,
        productName: productsNames || 'Payment for MadEdge order',
      });

      if (!invoiceData || !invoiceData.pageUrl) {
         throw new Error('Не вдалося отримати посилання на оплату від Monobank');
      }

      return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }

  } catch (error: any) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: error.message || 'Внутрішня помилка сервера' }, { status: 500 });
  }
}