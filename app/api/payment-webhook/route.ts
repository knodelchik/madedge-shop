import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // --- 🛡️ 1. SECURITY CHECK (Перевірка безпеки) ---
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const expectedSecret = process.env.MONOBANK_WEBHOOK_SECRET;

    // Перевіряємо, чи ми самі не забули додати ключ у змінні середовища
    if (!expectedSecret) {
      console.error('❌ CRITICAL: MONOBANK_WEBHOOK_SECRET is missing in .env');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Порівнюємо отриманий ключ із правильним
    if (secret !== expectedSecret) {
      console.warn('⛔ Webhook Unauthorized Attempt. IP:', req.headers.get('x-forwarded-for') || 'Unknown');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // --- END SECURITY CHECK ---


    const body = await req.json();
    console.log('Monobank Webhook:', body);

    const { status, reference } = body;

    // Уніфікуємо статуси: якщо 'success' -> ставимо 'paid'
    const orderStatus = status === 'success' ? 'paid' : (status === 'failure' ? 'failure' : 'pending');

    const updateData: any = {
      status: orderStatus, 
      payment_result: body,
      updated_at: new Date().toISOString()
    };

    if (status === 'success') {
      // 1. Оновлюємо статус замовлення та записуємо результат
      const { error } = await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', reference);

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
        // Якщо помилка, теж зберігаємо інфо
        await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', reference);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}