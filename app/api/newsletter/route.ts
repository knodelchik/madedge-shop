import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Ініціалізація клієнтів
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Використовуємо Service Role для гарантованого запису
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 1. Зберігаємо email в базу даних
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (dbError) {
      // Якщо такий email вже є (код 23505), це не помилка для користувача
      if (dbError.code === '23505') {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 2. Відправляємо вітальний лист через Resend
    // Важливо: Використовуйте 'onboarding@resend.dev' для тестів, або вашу верифіковану пошту
    await resend.emails.send({
      from: 'MadEdge <onboarding@resend.dev>', 
      to: email,
      subject: 'Вітаємо в MadEdge Community!',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Дякуємо за підписку! 🎉</h1>
          <p>Ви успішно підписалися на новини <strong>MadEdge</strong>.</p>
          <p>Ми будемо повідомляти вас про нові товари, акції та корисні поради по заточці інструментів.</p>
          <br />
          <p>З повагою,<br/>Команда MadEdge</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}