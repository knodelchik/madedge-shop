import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateFondySignature } from '../../lib/fondy';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const SECRET_KEY = process.env.FONDY_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    // Fondy надсилає дані як JSON (або Form, але зазвичай JSON для callback)
    // Якщо не працює, спробуйте req.formData()
    let body;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      // Фолбек для x-www-form-urlencoded
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    }

    console.log('Webhook Received:', body); // Для дебагу (дивіться логи Vercel/Localhost)

    // 1. Перевірка підпису (Безпека!)
    const receivedSignature = body.signature;
    const expectedSignature = generateFondySignature(body, SECRET_KEY);

    if (receivedSignature !== expectedSignature) {
      console.error('Invalid Signature:', { received: receivedSignature, expected: expectedSignature });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Перевірка статусу оплати
    const orderId = body.order_id;
    const orderStatus = body.order_status; // 'approved' - це успіх

    if (orderStatus === 'approved') {
      // 3. Оновлюємо статус в БД
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'success' }) // Або 'paid'
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json({ error: 'DB Update failed' }, { status: 500 });
      }
      console.log(`Order ${orderId} marked as success`);
    } else {
       console.log(`Order ${orderId} status: ${orderStatus}`);
       // Можна оновити на 'failed' або 'cancelled'
       if (orderStatus === 'declined' || orderStatus === 'expired') {
          await supabaseAdmin.from('orders').update({ status: 'failure' }).eq('id', orderId);
       }
    }

    // Fondy очікує 200 OK, інакше буде слати повтори
    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}