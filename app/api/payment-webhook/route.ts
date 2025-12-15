import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Monobank Webhook:', body);

    // Monobank надсилає таку структуру:
    // {
    //   invoiceId: "...",
    //   status: "success", (або "created", "processing", "failure")
    //   amount: 100,
    //   ccy: 980,
    //   reference: "order_12345...",  <-- Це наш ID замовлення
    //   modifiedDate: "..."
    // }

    const { status, reference } = body;

    if (status === 'success') {
      // 1. Оновлюємо статус замовлення
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'success' })
        .eq('id', reference); // reference дорівнює нашому uniqueOrderId

      if (error) {
          console.error('Error updating order status:', error);
          return NextResponse.json({ status: 'error' }, { status: 500 });
      }

      // 2. Списання товару (Stock logic)
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', reference);

      if (items) {
        for (const item of items) {
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();
            
          if (product) {
             const newStock = Math.max(0, product.stock - item.quantity);
             await supabaseAdmin
               .from('products')
               .update({ stock: newStock })
               .eq('id', item.product_id);
          }
        }
      }
    } else if (status === 'failure') {
        await supabaseAdmin
            .from('orders')
            .update({ status: 'failure' })
            .eq('id', reference);
    }

    // Monobank очікує 200 OK
    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}