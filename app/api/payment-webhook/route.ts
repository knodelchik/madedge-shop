import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Перевірка безпеки
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.MONOBANK_WEBHOOK_SECRET) {
      console.warn('Unauthorized webhook attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Monobank Webhook:', body);

    const { status, reference, invoiceId } = body;

    // 2. Визначення статусу
    let newStatus = 'pending';
    if (status === 'success') newStatus = 'paid';
    else if (status === 'failure') newStatus = 'failure';
    // Інші статуси (processing, created тощо) залишаться 'pending'

    // 3. Оновлення замовлення в БД
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: newStatus,
        payment_result: body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reference);

    if (updateError) {
      console.error('DB Update Error:', updateError);
      return NextResponse.json({ error: 'DB Error' }, { status: 500 });
    }

    // 4. ОТРИМАННЯ ПОВНИХ ДАНИХ (для листа та списання стоку)
    // Робимо це незалежно від статусу, щоб завжди знати контакти клієнта
    const { data: fullOrder } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          product_id,
          products (title, stock)
        ),
        users (full_name, email, phone)
      `)
      .eq('id', reference)
      .single();

    // 5. ВІДПРАВКА ЛИСТА АДМІНУ (При будь-якому статусі!)
    if (fullOrder) {
      try {
        await sendAdminNotification(reference, fullOrder, newStatus, body);
      } catch (emailError) {
        console.error('Email Sending Error:', emailError);
      }
    }

    // 6. Списання стоку (Тільки якщо статус 'paid')
    if (newStatus === 'paid' && fullOrder?.order_items) {
      for (const item of fullOrder.order_items) {
        // @ts-ignore
        const currentStock = item.products?.stock || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        
        await supabaseAdmin
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}

// Функція формування та відправки листа
async function sendAdminNotification(orderId: string, orderData: any, status: string, webhookBody: any) {
  // Визначаємо тему та колір в залежності від статусу
  let subjectPrefix = '⏳ Оновлення замовлення';
  let statusColor = '#eab308'; // Жовтий (pending)
  let statusMessage = 'Статус оновлено: Очікування / Обробка';

  if (status === 'paid') {
    subjectPrefix = '✅ НОВЕ ЗАМОВЛЕННЯ ОПЛАЧЕНО';
    statusColor = '#22c55e'; // Зелений
    statusMessage = 'Успішна оплата! Потрібно відправляти товар.';
  } else if (status === 'failure') {
    subjectPrefix = '⚠️ ПОМИЛКА ОПЛАТИ';
    statusColor = '#ef4444'; // Червоний
    statusMessage = `Оплата не пройшла. Причина: ${webhookBody.errCode || 'Невідома помилка'}. Зв'яжіться з клієнтом!`;
  }

  // Список товарів
  const itemsListHtml = orderData.order_items
    ?.map(
      (item: any) =>
        `<li style="margin-bottom: 5px;">
           <strong>${item.products?.title || 'Unknown Product'}</strong> 
           — ${item.quantity} шт. x ${item.price} $
         </li>`
    )
    .join('');

  // Адреса
  let addressString = 'Не вказано';
  if (orderData.shipping_address) {
    const addr = orderData.shipping_address;
    addressString = `${addr.country || ''}, ${addr.city || ''}, ${addr.street || ''}`;
    if (addr.zip_code) addressString += ` (${addr.zip_code})`;
    if (addr.phone) addressString += `<br><strong>Тел. отримувача:</strong> ${addr.phone}`;
  }

  // Відправка
  await resend.emails.send({
    from: 'MadEdge Bot <onboarding@resend.dev>', // Або ваш верифікований домен
    to: process.env.ADMIN_EMAIL || 'ваш_email@example.com',
    subject: `${subjectPrefix} #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        
        <div style="background-color: ${statusColor}; color: white; padding: 10px 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0;">${statusMessage}</h2>
        </div>

        <p><strong>ID замовлення:</strong> ${orderId}</p>
        <p><strong>Сума:</strong> ${orderData.total_amount} UAH (екв.)</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        
        <h3 style="color: #333;">👤 Клієнт (Зв'язок)</h3>
        <p style="background-color: #f9fafb; padding: 10px; border-radius: 5px;">
          <strong>Ім'я:</strong> ${orderData.users?.full_name || 'Гість'}<br>
          <strong>Email:</strong> <a href="mailto:${orderData.users?.email}">${orderData.users?.email}</a><br>
          <strong>Телефон:</strong> <a href="tel:${orderData.users?.phone}">${orderData.users?.phone || 'Не вказано'}</a>
        </p>

        <h3 style="color: #333;">📍 Доставка</h3>
        <p>${addressString}</p>
        <p><strong>Метод:</strong> ${orderData.shipping_service || 'Standard'}</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

        <h3 style="color: #333;">🛒 Товари</h3>
        <ul style="padding-left: 20px;">
          ${itemsListHtml}
        </ul>

        <div style="margin-top: 30px; font-size: 12px; color: #888;">
          <p>Технічна інформація (від банку): InvoiceId: ${webhookBody.invoiceId || '-'}, Status: ${status}</p>
        </div>
      </div>
    `,
  });
  console.log(`Email sent for status: ${status}`);
}