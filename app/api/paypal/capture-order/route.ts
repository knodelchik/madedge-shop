// app/api/paypal/capture-order/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAccessToken, PAYPAL_API_BASE } from '../../../lib/paypal';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    // 1. Отримуємо токен
    const accessToken = await generateAccessToken();

    // 2. Робимо запит на Capture
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();

    if (!response.ok) {
        // Якщо помилка, повертаємо деталі
        return NextResponse.json({ error: captureData }, { status: response.status });
    }

    // Перевіряємо статус (COMPLETED)
    if (captureData.status !== 'COMPLETED') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // 3. Оновлюємо базу даних
    // Дістаємо наш reference_id, який ми передали при створенні
    const internalOrderId = captureData.purchase_units?.[0]?.reference_id;

    if (internalOrderId) {
        const { error: dbError } = await supabaseAdmin
        .from('orders')
        .update({
            status: 'paid',
            payment_result: captureData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', internalOrderId);

        if (dbError) console.error('Supabase update error:', dbError);
    }

    return NextResponse.json({ status: 'success', data: captureData });

  } catch (error: any) {
    console.error('Capture Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}