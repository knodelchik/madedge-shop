import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // 1. Перевірка безпеки через secret
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.MONOBANK_WEBHOOK_SECRET) {
      console.warn('Unauthorized webhook attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Monobank Webhook:', body);

    const { status, reference, invoiceId } = body;

    // 2. Оновлення статусу
    let newStatus = 'pending';
    if (status === 'success') newStatus = 'paid';
    else if (status === 'failure') newStatus = 'failure';

    // Оновлюємо замовлення
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: newStatus,
        payment_id: invoiceId,
        payment_result: body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reference); // reference = наш uniqueOrderId

    if (updateError) {
      console.error('DB Update Error:', updateError);
      return NextResponse.json({ error: 'DB Error' }, { status: 500 });
    }

    // 3. Списання стоку (лише якщо успіх)
    if (newStatus === 'paid') {
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
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
