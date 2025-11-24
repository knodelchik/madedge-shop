import { NextResponse } from 'next/server';
import { generateFondySignature } from '../../lib/fondy';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 1. Ініціалізуємо Supabase ТІЛЬКИ всередині функції
    // Це гарантує, що змінні оточення вже завантажені
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Якщо ключа немає — кидаємо помилку, а не використовуємо ANON_KEY
    if (!supabaseServiceKey) {
      console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Створюємо адмін-клієнт (ігнорує RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const SECRET_KEY = process.env.FONDY_SECRET_KEY || 'test';

    // 2. Отримуємо дані
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    }

    console.log('Webhook received:', body.order_id, body.order_status);

    // 3. Перевірка підпису
    const { signature, ...params } = body;
    const expectedSignature = generateFondySignature(params, SECRET_KEY);

    if (signature !== expectedSignature) {
      console.error('Signature Mismatch!');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 4. Оновлення статусу
    const orderId = params.order_id;
    const orderStatus = params.order_status;

    let dbStatus = 'pending';
    if (orderStatus === 'approved') dbStatus = 'success';
    else if (orderStatus === 'declined' || orderStatus === 'expired') dbStatus = 'failure';

    if (dbStatus !== 'pending') {
      const { error } = await supabase
        .from('orders')
        .update({ status: dbStatus })
        .eq('id', orderId);

      if (error) {
        console.error('DB Update Error:', error);
        return NextResponse.json({ error: 'DB Error' }, { status: 500 });
      }
      console.log(`Order ${orderId} updated to ${dbStatus}`);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}