import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // Отримуємо дані, які Fondy надіслав при редіректі
    const formData = await req.formData();
    const orderId = formData.get('order_id') as string;
    const orderStatus = formData.get('order_status') as string;
    const responseStatus = formData.get('response_status') as string;

    console.log('Payment Return Data:', { orderId, orderStatus });

    // Якщо оплата успішна, оновимо статус в БД прямо тут
    if (responseStatus === 'success' && orderStatus === 'approved' && orderId) {
      
      // Ініціалізуємо Supabase (бажано SERVICE_ROLE_KEY, щоб оновити будь-яке замовлення)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error } = await supabase
        .from('orders')
        .update({ status: 'success' })
        .eq('id', orderId);
        
      if (error) console.error('Error updating order on return:', error);
      else console.log('Order updated to success via Return URL');
    }

    // Редірект на сторінку результату
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    // Додаємо статус у URL, щоб показати правильну іконку
    const redirectStatus = (responseStatus === 'success' && orderStatus === 'approved') ? 'success' : 'failure';
    
    return NextResponse.redirect(`${baseUrl}/order/result?status=${redirectStatus}&order_id=${orderId}`, 303);

  } catch (error) {
    console.error('Payment Return Error:', error);
    // У разі помилки все одно намагаємось перенаправити на головну або профіль
    const url = new URL(req.url);
    return NextResponse.redirect(`${url.protocol}//${url.host}/profile`, 303);
  }
}