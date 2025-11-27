import { NextResponse } from 'next/server';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);
// Вкажіть сюди вашу реальну пошту, куди приходитимуть заявки
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    // Відправка листа адміну
    const { data, error } = await resend.emails.send({
      from: 'MadEdge Contact <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      replyTo: email, // Це дозволяє натиснути "Відповісти" в пошті і написати клієнту
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
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}