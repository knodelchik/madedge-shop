import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMonoInvoice } from '../../lib/monobank';
import client from '../../lib/paypal';
// Імпортуємо необхідні класи. 
// Якщо TS свариться на OrdersController, ми використаємо (client as any) або ordersController as any нижче.
import { OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amountUSD, amountUAH, items, shippingAddress, shippingCost, shippingType, method } = body;

    // Валідація даних
    if (!amountUSD || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }

    const userId = shippingAddress.user_id;
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 1. Створення запису замовлення в БД (Status: pending)
    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: amountUSD,
      status: 'pending',
      payment_method: method,
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) throw new Error(dbError.message);

    // 2. Збереження товарів у БД
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_id: item.id,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));

    await supabaseAdmin.from('order_items').insert(orderItemsData);

    // === PAYPAL ЛОГІКА (Оновлена для React SDK) ===
    if (method === 'paypal') {
      try {
        const ordersController = new OrdersController(client);

        const payload = {
          body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
              {
                referenceId: uniqueOrderId,
                amount: {
                  currencyCode: 'USD',
                  value: amountUSD.toFixed(2),
                },
              },
            ],
            // Для React SDK paymentSource не є обов'язковим, але experienceContext корисний
            // для налаштування вигляду (назва бренду тощо)
            paymentSource: {
                paypal: {
                    experienceContext: {
                        brandName: "MadEdge Shop",
                        userAction: "PAY_NOW",
                        // Важливо: React SDK сам керує поверненням, але ці URL потрібні для API
                        returnUrl: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
                        cancelUrl: `${BASE_URL}/order?status=cancelled`,
                    }
                }
            }
          },
        };

        // Викликаємо метод створення замовлення.
        // Використовуємо 'as any', щоб обійти можливу помилку типів TS, якщо визначення відстають
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { body: responseBody } = await (ordersController as any).ordersCreate(payload);

        // Парсимо відповідь
        const orderData = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;

        // ВАЖЛИВО: Повертаємо тільки ID замовлення, як очікує React SDK
        return NextResponse.json({ id: orderData.id });

      } catch (paypalError: any) {
    // ЗМІНЕНО: Виводимо об'єкт помилки напряму, а не через JSON.stringify
    console.error('PayPal API Error Full Object:', paypalError); 
    console.error('PayPal Error Message:', paypalError.message); // Виводимо текст помилки
    
    if (paypalError.statusCode) {
         console.error('PayPal Status Code:', paypalError.statusCode); // Код відповіді (400, 401, etc.)
         console.error('PayPal Response Body:', paypalError._originalError?.text || paypalError.message);
    }

    throw new Error('PayPal creation failed: ' + paypalError.message);
}
    }

    // === MONOBANK ЛОГІКА (Без змін) ===
    else {
      const amountInCents = Math.round(Number(amountUAH) * 100);
      const productsNames = items.map((i: any) => `${i.title} x${i.quantity}`).join(', ').substring(0, 250);

      const invoiceData = await createMonoInvoice({
        order_id: uniqueOrderId,
        amount: amountInCents,
        ccy: 980,
        redirectUrl: `${BASE_URL}/order/result?source=monobank&orderId=${uniqueOrderId}`,
        webHookUrl: `${BASE_URL}/api/payment-webhook`,
        productName: productsNames || 'Payment for order',
      });

      // Для Monobank ми повертаємо URL, бо там редірект, а не popup
      return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }

  } catch (error: any) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}