import { NextResponse } from 'next/server';
import { generateFondySignature } from '../../lib/fondy';
import { createClient } from '@supabase/supabase-js';

// === ВАЖЛИВА ЗМІНА: Використовуємо Service Role Key ===
// Це дозволяє ігнорувати RLS і гарантовано записати замовлення
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

if (!supabaseServiceKey) {
  console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
}

// Створюємо адмін-клієнт
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const MERCHANT_ID = process.env.FONDY_MERCHANT_ID ;
const SECRET_KEY = process.env.FONDY_SECRET_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      totalAmount, 
      items, 
      shippingAddress, 
      shippingCost, 
      shippingType, 
      method 
    } = body;

    if (!totalAmount || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані замовлення' }, { status: 400 });
    }

    // Перевірка user_id (важливо!)
    const userId = shippingAddress.user_id; 
    if (!userId) {
        console.error('Missing user_id in shipping address:', shippingAddress);
        return NextResponse.json({ error: 'User ID not found in address' }, { status: 400 });
    }

    // Генеруємо унікальний ID
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // === ЗБЕРЕЖЕННЯ В БД (через supabaseAdmin) ===
    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending', // Статус "Очікує оплати"
      payment_method: method,
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) {
      // Цей лог покаже точну причину помилки в терміналі VS Code
      console.error('Detailed Database Error:', dbError); 
      return NextResponse.json({ error: `DB Error: ${dbError.message}` }, { status: 500 });
    }

    // Зберігаємо товари
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsData);
    
    if (itemsError) {
        console.error('Items Save Error:', itemsError);
        // Не зупиняємо процес, якщо товари не записались, але замовлення є
    }

    // === ПІДГОТОВКА FONDY ===
    const amountInCents = Math.round(Number(totalAmount) * 100);
    
    // Формуємо опис (короткий, щоб не перевищити ліміт)
    const itemsSummary = items.map((i: any) => `${i.title} x${i.quantity}`).join(', ');
    const orderDesc = itemsSummary.substring(0, 1000); 

    const requestData: any = {
      order_id: uniqueOrderId,
      merchant_id: MERCHANT_ID,
      order_desc: orderDesc || 'Order payment',
      amount: amountInCents,
      currency: 'UAH',
      response_url: `${BASE_URL}/api/payment-return`, 
      server_callback_url: `${BASE_URL}/api/payment-webhook`,
      lang: 'uk',
      sender_email: shippingAddress.email || '', 
    };

    requestData.signature = generateFondySignature(requestData, SECRET_KEY);

    const response = await fetch('https://pay.fondy.eu/api/checkout/url/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request: requestData }),
    });

    const data = await response.json();

    if (data.response.response_status === 'failure') {
      console.error('Fondy Error Response:', data.response);
      return NextResponse.json(
        { error: data.response.error_message || 'Помилка Fondy' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      payment_url: data.response.checkout_url 
    });

  } catch (error: any) {
    console.error('Payment API Critical Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}