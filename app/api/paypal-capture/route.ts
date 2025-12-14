import { NextResponse } from 'next/server';
import paypalClient from '../../lib/paypal';
import paypal from '@paypal/checkout-server-sdk';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { token, orderId } = await req.json(); // token - це ID замовлення в системі PayPal

    if (!token || !orderId) {
      return NextResponse.json({ error: 'Missing token or orderId' }, { status: 400 });
    }

    // Виконуємо Capture (списання грошей)
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    
    const response = await paypalClient().execute(request);

    if (response.result.status === 'COMPLETED') {
      // 1. Оновлюємо статус замовлення на success
      await supabaseAdmin
        .from('orders')
        .update({ status: 'success' })
        .eq('id', orderId);

      // 2. Списання залишків (копія логіки з вебхука Fondy)
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      if (items) {
        for (const item of items) {
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();
            
          if (product) {
             const newStock = Math.max(0, product.stock - item.quantity);
             await supabaseAdmin.from('products').update({ stock: newStock }).eq('id', item.product_id);
          }
        }
      }

      return NextResponse.json({ status: 'success' });
    } else {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('PayPal Capture Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}