import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Переконайтеся, що ви оновили lib/paypal.ts за попередньою інструкцією
import { generateAccessToken, PAYPAL_API_BASE } from '../../../lib/paypal';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amountUSD, items, shippingAddress, shippingCost, shippingType } = body;

    // Валідація
    if (!amountUSD || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Відсутні обов\'язкові дані' }, { status: 400 });
    }

    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = shippingAddress.user_id;

    // 1. Створюємо замовлення в Supabase (PENDING)
    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: amountUSD,
      status: 'pending',
      payment_method: 'paypal',
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) throw new Error(`Supabase Error: ${dbError.message}`);

    // 2. Зберігаємо товари в БД
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_id: item.id,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));
    await supabaseAdmin.from('order_items').insert(orderItemsData);

    // 3. Створюємо замовлення в PayPal (Native API Call)
    const accessToken = await generateAccessToken();
    
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
    
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: uniqueOrderId, // Наш внутрішній ID
          amount: {
            currency_code: "USD",
            value: amountUSD.toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "MadEdge Shop",
            user_action: "PAY_NOW",
            return_url: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
            cancel_url: `${BASE_URL}/order?status=cancelled`,
          },
        },
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error("PayPal Error Response:", orderData);
      throw new Error(JSON.stringify(orderData));
    }

    // Повертаємо ID для кнопки PayPal
    return NextResponse.json({ id: orderData.id });

  } catch (error: any) {
    console.error('PayPal Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Error creating order' }, { status: 500 });
  }
}