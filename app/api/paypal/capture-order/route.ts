// app/api/paypal/capture-order/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import client from '@/app/lib/paypal';
import { OrdersController } from '@paypal/paypal-server-sdk';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json(); // Це ID від PayPal (наприклад, 5O19...)

    // 1. Захоплюємо платіж через PayPal SDK
    const ordersController = new OrdersController(client);
    const { body: responseBody } = await (ordersController as any).ordersCapture({
      id: orderID,
      prefer: 'return=representation',
    });

    const captureData = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;

    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // 2. Отримуємо наш внутрішній ID замовлення з purchase_units
    // PayPal повертає reference_id, який ми передали при створенні
    const internalOrderId = captureData.purchase_units?.[0]?.reference_id;

    if (!internalOrderId) {
         console.error('No reference_id found in PayPal transaction');
         return NextResponse.json({ error: 'Order reference lost' }, { status: 500 });
    }

    // 3. Оновлюємо статус в Supabase
    const { error: dbError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        payment_result: captureData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', internalOrderId);

    if (dbError) console.error('Supabase update error:', dbError);

    return NextResponse.json({ status: 'success', data: captureData });
  } catch (error: any) {
    console.error('Capture Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}