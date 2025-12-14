import { NextResponse } from 'next/server';
import { generateFondySignature } from '../../lib/fondy';
import { createClient } from '@supabase/supabase-js';
import paypalClient from '../../lib/paypal'; // <--- Імпорт PayPal клієнта
import paypal from '@paypal/checkout-server-sdk'; // <--- Імпорт SDK

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const MERCHANT_ID = process.env.FONDY_MERCHANT_ID;
const SECRET_KEY = process.env.FONDY_SECRET_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { amountUSD, amountUAH, items, shippingAddress, shippingCost, shippingType, method } = body;

    if (!amountUSD || !amountUAH || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }

    const userId = shippingAddress.user_id; 
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 1. Створюємо замовлення в базі
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

    // 2. Зберігаємо товари
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_id: item.id,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));
    
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsData);
    if (itemsError) throw new Error('Помилка запису товарів: ' + itemsError.message);

    // ==========================================
    // ЛОГІКА ДЛЯ PAYPAL
    // ==========================================
    if (method === 'paypal') {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: uniqueOrderId, // Наш внутрішній ID замовлення
                amount: {
                    currency_code: 'USD', // PayPal приймає долари
                    value: amountUSD.toFixed(2)
                }
            }],
            application_context: {
                // Куди повертати користувача після оплати
                return_url: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
                cancel_url: `${BASE_URL}/order?status=cancelled`
            }
        });

        const order = await paypalClient().execute(request);
        
        // Знаходимо посилання для підтвердження (approve)
        const approveLink = order.result.links.find((link: any) => link.rel === 'approve').href;

        return NextResponse.json({ payment_url: approveLink });
    }

    // ==========================================
    // ЛОГІКА ДЛЯ FONDY (Залишається як була)
    // ==========================================
    else {
        const amountInCents = Math.round(Number(amountUAH) * 100);
        const orderDesc = items.map((i: any) => `${i.title} x${i.quantity}`).join(', ').substring(0, 1000);

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

        if (data.response?.response_status === 'failure') {
          return NextResponse.json({ error: data.response.error_message }, { status: 400 });
        }

        return NextResponse.json({ payment_url: data.response.checkout_url });
    }

  } catch (error: any) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}