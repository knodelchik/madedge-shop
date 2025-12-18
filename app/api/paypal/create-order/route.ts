// app/api/paypal/create-order/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import client from '@/app/lib/paypal';
import { OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amountUSD, items, shippingAddress, shippingCost, shippingType } = body;

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

    if (dbError) throw new Error(`Supabase error: ${dbError.message}`);

    // 2. Зберігаємо товари в Supabase
     const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_id: item.id,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));
    await supabaseAdmin.from('order_items').insert(orderItemsData);

    // 3. Створюємо замовлення в PayPal
    const ordersController = new OrdersController(client);
    
    const { body: responseBody } = await (ordersController as any).ordersCreate({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            referenceId: uniqueOrderId, // Вказуємо наш внутрішній ID
            amount: {
              currencyCode: 'USD',
              value: amountUSD.toFixed(2),
            },
          },
        ],
      },
    });

    const orderData = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;

    return NextResponse.json({ id: orderData.id });
  } catch (error: any) {
    console.error('PayPal Create Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}