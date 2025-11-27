import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Отримуємо дані, які надіслав Fondy (нам потрібен тільки ID для красивого URL)
    const formData = await req.formData();
    const orderId = formData.get('order_id') as string;
    const responseStatus = formData.get('response_status') as string; // success або failure

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Використовуємо 303 See Other — це спеціальний код, 
    // який каже браузеру: "Зроби GET запит на цю нову адресу"
    return NextResponse.redirect(
      `${baseUrl}/order/result?order_id=${orderId}&status=${responseStatus}`, 
      303
    );

  } catch (error) {
    console.error('Return URL Error:', error);
    // Якщо щось пішло не так, просто кидаємо на головну або в профіль
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`, 303);
  }
}