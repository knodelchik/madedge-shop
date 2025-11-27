import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const origin = new URL(req.url).origin; // http://localhost:3000 або ваш домен

    // 1. Генеруємо посилання для відновлення (Supabase не шле лист, тільки дає лінк)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${origin}/auth/update-password`, // Куди перекинути користувача
      },
    });

    if (error) {
      console.error('Generate Link Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { action_link } = data.properties;

    // 2. Відправляємо свій лист через Resend
    await resend.emails.send({
      from: 'MadEdge Security <onboarding@resend.dev>', // Або ваша верифікована пошта
      to: email,
      subject: 'Відновлення паролю MadEdge',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Відновлення паролю</h2>
          <p>Ви надіслали запит на зміну паролю. Натисніть кнопку нижче, щоб створити новий пароль:</p>
          <br/>
          <a href="${action_link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Змінити пароль</a>
          <br/><br/>
          <p style="color: #666; font-size: 12px;">Якщо ви не робили цей запит, просто проігноруйте цей лист.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Recover API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}