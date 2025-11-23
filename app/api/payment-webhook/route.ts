import { NextResponse } from 'next/server';
import { generateFondySignature } from '../../lib/fondy';
import { createClient } from '@supabase/supabase-js';

// ВАЖЛИВО: Використовуємо SERVICE_ROLE_KEY для прав адміністратора
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

// Якщо ключа немає, спробуємо анонімний (але краще додати сервісний)
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const SECRET_KEY = process.env.FONDY_SECRET_KEY || 'test';

export async function POST(req: Request) {
  try {
    // 1. Отримуємо тіло запиту
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    }

    console.log('Webhook received:', body); // <-- ДИВІТЬСЯ В КОНСОЛЬ СЕРВЕРА

    // 2. Перевірка підпису
    const { signature, ...params } = body;
    
    // Fondy іноді надсилає пусті поля, які впливають на підпис.
    // Наша функція generateFondySignature фільтрує їх, тому все має бути ок.
    const expectedSignature = generateFondySignature(params, SECRET_KEY);

    if (signature !== expectedSignature) {
      console.error(`Signature Mismatch! Expected: ${expectedSignature}, Got: ${signature}`);
      // УВАГА: Для тестів можна тимчасово закоментувати return, щоб перевірити логіку оновлення БД
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 3. Отримання статусу
    const orderId = params.order_id;
    const orderStatus = params.order_status; // approved, declined, expired

    console.log(`Processing order: ${orderId}, Status: ${orderStatus}`);

    // 4. Визначаємо статус для БД
    let dbStatus = 'pending';
    if (orderStatus === 'approved') {
      dbStatus = 'success';
    } else if (orderStatus === 'declined' || orderStatus === 'expired') {
      dbStatus = 'failure';
    }

    // 5. Оновлюємо БД
    if (dbStatus !== 'pending') {
      const { error } = await supabase
        .from('orders')
        .update({ status: dbStatus })
        .eq('id', orderId);

      if (error) {
        console.error('DB Update Error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      console.log(`Order ${orderId} updated to ${dbStatus}`);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook Critical Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}