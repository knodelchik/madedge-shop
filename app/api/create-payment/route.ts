import { NextResponse } from 'next/server';
import { generateFondySignature } from '../../lib/fondy';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const MERCHANT_ID = process.env.FONDY_MERCHANT_ID;
const SECRET_KEY = process.env.FONDY_SECRET_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ПРИЙМАЄМО ДВІ СУМИ:
    // amountUSD - чисті долари для бази даних
    // amountUAH - гривні для Fondy
    const { amountUSD, amountUAH, items, shippingAddress, shippingCost, shippingType, method } = body;

    // Валідація
    if (!amountUSD || !amountUAH || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані (відсутня сума USD або UAH)' }, { status: 400 });
    }

    const userId = shippingAddress.user_id; 
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 1. В БАЗУ ПИШЕМО ДОЛАРИ (USD)
    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: amountUSD, // <--- ЗБЕРІГАЄМО USD
      status: 'pending',
      payment_method: method,
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) throw new Error(dbError.message);

    // Зберігаємо товари
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price, // Ціна товару зазвичай теж в USD в базі
      image_url: item.images?.[0] || ''
    }));
    await supabaseAdmin.from('order_items').insert(orderItemsData);

    // 2. В FONDY ВІДПРАВЛЯЄМО ГРИВНІ (UAH)
    // Fondy приймає копійки, тому множимо UAH на 100
    const amountInCents = Math.round(Number(amountUAH) * 100);
    
    const orderDesc = items.map((i: any) => `${i.title} x${i.quantity}`).join(', ').substring(0, 1000);

    const requestData: any = {
      order_id: uniqueOrderId,
      merchant_id: MERCHANT_ID,
      order_desc: orderDesc || 'Order payment',
      amount: amountInCents, // <--- ОПЛАТА В ГРИВНІ
      currency: 'UAH',       // <--- ВАЛЮТА ГРИВНЯ
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

    if (data.response?.response_status === 'failure') {
      return NextResponse.json({ error: data.response.error_message }, { status: 400 });
    }

    return NextResponse.json({ payment_url: data.response.checkout_url });

  } catch (error: any) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}