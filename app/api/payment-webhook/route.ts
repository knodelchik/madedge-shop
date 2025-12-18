import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Monobank Webhook:', body);

    // Monobank надсилає таку структуру (приклад):
    // {
    //   invoiceId: "pOrN7...",
    //   status: "success",
    //   amount: 415000,
    //   ccy: 980,
    //   reference: "order_173...",  <-- ID замовлення
    //   createdDate: "2024-...",
    //   modifiedDate: "2024-..."
    // }

    const { status, reference } = body;

    // Створюємо об'єкт для оновлення.
    // Зберігаємо весь body від Монобанку в payment_result
    const updateData: any = {
      status: status === 'success' ? 'paid' : status === 'failure' ? 'failed' : 'pending', // Краще використовувати 'paid' замість 'success', щоб було як у PayPal
      payment_result: body, // <--- ОСЬ ТУТ МИ ЗБЕРІГАЄМО ДАНІ
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
        // Якщо помилка, теж зберігаємо інфо, чому не вийшло
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