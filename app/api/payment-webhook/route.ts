import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateFondySignature } from '../../lib/fondy';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Використовуємо Service Role для прав адміна (обхід RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const SECRET_KEY = process.env.FONDY_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    let body;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    }

    console.log('Webhook Received:', body);

    // 1. Перевірка підпису
    const receivedSignature = body.signature;
    const expectedSignature = generateFondySignature(body, SECRET_KEY);

    if (receivedSignature !== expectedSignature) {
      console.error('Invalid Signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Отримання даних
    const orderId = body.order_id;
    const orderStatus = body.order_status;

    if (orderStatus === 'approved') {
      // 3. Оновлюємо статус замовлення
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'success' })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
        return NextResponse.json({ error: 'DB Update failed' }, { status: 500 });
      }

      // --- НОВА ЛОГІКА: СПИСАННЯ ТОВАРУ ---
      try {
        // А. Отримуємо товари цього замовлення
        const { data: items, error: itemsError } = await supabaseAdmin
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        if (items && items.length > 0) {
          for (const item of items) {
            // Б. Отримуємо поточний залишок товару
            const { data: product, error: productError } = await supabaseAdmin
              .from('products')
              .select('stock')
              .eq('id', item.product_id)
              .single();

            if (productError) {
                console.error(`Error fetching product ${item.product_id}:`, productError);
                continue; 
            }

            // В. Обчислюємо новий залишок (не менше 0)
            const newStock = Math.max(0, (product.stock || 0) - item.quantity);

            // Г. Оновлюємо товар
            await supabaseAdmin
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.product_id);
              
            console.log(`Decreased stock for product ${item.product_id}: ${product.stock} -> ${newStock}`);
          }
        }
      } catch (stockError) {
        // Не зупиняємо відповідь "ОК" для Fondy, але логуємо помилку списання
        console.error('Error updating stock levels:', stockError);
      }
      // -------------------------------------

      console.log(`Order ${orderId} successfully processed.`);
    } else {
       console.log(`Order ${orderId} status: ${orderStatus}`);
       if (orderStatus === 'declined' || orderStatus === 'expired') {
          await supabaseAdmin.from('orders').update({ status: 'failure' }).eq('id', orderId);
       }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}