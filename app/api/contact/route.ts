import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Ваша особиста пошта (Gmail), куди будуть падати заявки
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nekrasovss@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    const msg = {
      to: ADMIN_EMAIL, // Лист прийде вам
      from: 'info@madedge.net', // ⚠️ Відправник завжди ваш сайт (SendGrid вимагає цього)
      replyTo: email, // ⚠️ А ось "Відповісти" буде працювати на пошту клієнта
      subject: `Нове повідомлення: ${subject || 'Без теми'}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>Нове звернення з сайту MadEdge</h2>
          <p><strong>Ім'я:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Тема:</strong> ${subject}</p>
          <hr />
          <h3>Повідомлення:</h3>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error(error.response.body); // Деталі помилки, якщо щось піде не так
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
