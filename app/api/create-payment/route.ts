import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMonoInvoice } from '../../lib/monobank';
import client from '../../lib/paypal';
import { OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amountUSD, amountUAH, items, shippingAddress, shippingCost, shippingType, method } = body;

    // Валідація
    if (!amountUSD || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }

    const userId = shippingAddress.user_id;
    // Створюємо унікальний ID.
    // УВАГА: Для PayPal важливо, щоб ID не повторювався, якщо ви тестуєте.
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 1. Створюємо замовлення в БД (Supabase)
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

    if (dbError) throw new Error(`Supabase Error: ${dbError.message}`);

    // 2. Зберігаємо товари (Order Items)
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_id: item.id,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));
    
    await supabaseAdmin.from('order_items').insert(orderItemsData);

    // === PAYPAL ЛОГІКА ===
    if (method === 'paypal') {
      try {
        const ordersController = new OrdersController(client);

        const payload = {
          body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
              {
                referenceId: uniqueOrderId, // Прив'язуємо ID з нашої бази до транзакції PayPal
                amount: {
                  currencyCode: 'USD',
                  value: amountUSD.toFixed(2),
                },
              },
            ],
            // experienceContext важливий, навіть якщо використовується попап
            paymentSource: {
                paypal: {
                    experienceContext: {
                        brandName: "MadEdge Shop",
                        userAction: "PAY_NOW",
                        returnUrl: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
                        cancelUrl: `${BASE_URL}/order?status=cancelled`,
                    }
                }
            }
          },
        };

        // Виконуємо запит. 
        // Використовуємо 'as any', щоб TypeScript не сварився на розбіжності типів у бібліотеці
        // Правильний метод SDK - ordersCreate
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { body: responseBody } = await (ordersController as any).ordersCreate(payload);

        // Парсимо відповідь
        const orderData = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;

        // Повертаємо ID замовлення (для PayPal Buttons) і наш внутрішній ID
        return NextResponse.json({ 
            id: orderData.id, 
            internalOrderId: uniqueOrderId 
        });

      } catch (paypalError: any) {
        console.error('PayPal Create Error:', paypalError);
        // Спробуємо дістати детальне повідомлення про помилку
        let errorMessage = paypalError.message;
        try {
            if (paypalError.body) {
                const parsedBody = JSON.parse(paypalError.body);
                errorMessage = parsedBody.message || errorMessage;
            }
        } catch (e) { /* ignore */ }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    }

    // === MONOBANK ЛОГІКА ===
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

      // Для Mono повертаємо посилання на сторінку оплати
      return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }

  } catch (error: any) {
    console.error('Global Create Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}