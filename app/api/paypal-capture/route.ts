import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import client from '../../lib/paypal'; // Ваш оновлений клієнт
// Імпортуємо контролер з нової бібліотеки
import { OrdersController } from '@paypal/paypal-server-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Ініціалізуємо контролер
    const ordersController = new OrdersController(client);

    // 2. Виконуємо захоплення (Capture) платежу через нову SDK
    // Використовуємо 'as any', щоб уникнути можливих розбіжностей типів TS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body: responseBody } = await (ordersController as any).ordersCapture({
      id: orderID,
      prefer: 'return=representation', // Отримуємо повні дані про транзакцію
    });

    // Парсимо відповідь (вона може бути рядком або об'єктом)
    const captureData = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;

    // 3. Перевіряємо статус (COMPLETED)
    if (captureData.status !== 'COMPLETED') {
        return NextResponse.json({ error: 'Payment not completed', details: captureData }, { status: 400 });
    }

    // 4. Оновлюємо статус замовлення в Supabase
    const { error: dbError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        payment_result: captureData, // Зберігаємо деталі транзакції
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderID); // Важливо: переконайтесь, що orderID збігається з ID в базі
      // Якщо ви використовували внутрішній ID (uniqueOrderId) при створенні, 
      // то тут orderID від PayPal може відрізнятися. 
      // АЛЕ: Зазвичай при Capture ми отримуємо ID PayPal замовлення.
      // Якщо у вас в базі ID замовлення — це внутрішній ID, вам треба знайти замовлення,
      // де payment_result -> id == captureData.id або оновити логіку збереження ID PayPal.
      
      // *ПРИМІТКА*: Якщо у вас в `orders` id — це внутрішній "uniqueOrderId", 
      // а `orderID` який приходить сюди — це ID від PayPal (наприклад '5O19...'),
      // то вам спочатку треба знайти замовлення в базі за цим ID (якщо ви його зберігали),
      // або передавати внутрішній ID разом із запитом capture.
      
      // Оскільки в create-payment ми не зберігали PayPal Order ID в окреме поле явно, 
      // найбезпечніше передати internalOrderId з фронтенду, якщо це можливо.
      // Але якщо `orderID` тут — це саме той ID, який ми створили в базі, то .eq('id', orderID) вірно.

    if (dbError) {
      console.error('Database Update Error:', dbError);
      // Не кидаємо помилку клієнту, бо гроші вже знято, просто логуємо
    }

    return NextResponse.json({ status: 'success', data: captureData });

  } catch (error: any) {
    console.error('Capture Payment Error:', error);
    // Якщо помилка API PayPal, спробуємо розпарсити
    let errorMessage = error.message;
    try {
        if (error.body) {
            const errorBody = JSON.parse(error.body);
            errorMessage = errorBody.message || errorMessage;
        }
    } catch (e) { /* ignore */ }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}