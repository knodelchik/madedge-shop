import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json();
    const origin = new URL(req.url).origin;

    // 1. Створюємо користувача (але не підтверджуємо автоматично)
    // Використовуємо admin.createUser, щоб обійти ліміти rate-limit з клієнта
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: false, // Користувач не підтверджений
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    if (!user.user) return NextResponse.json({ error: 'User creation failed' }, { status: 500 });

    // 2. Генеруємо посилання підтвердження
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: `${origin}/profile`,
      },
    });

    if (linkError) {
      return NextResponse.json({ error: linkError.message }, { status: 400 });
    }

    const { action_link } = linkData.properties;

    // 3. Відправляємо лист
    await resend.emails.send({
      from: 'MadEdge <onboarding@resend.dev>',
      to: email,
      subject: 'Підтвердження реєстрації',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Ласкаво просимо, ${full_name}!</h1>
          <p>Дякуємо за реєстрацію в MadEdge. Будь ласка, підтвердіть вашу пошту:</p>
          <br/>
          <a href="${action_link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Підтвердити пошту</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true, user: user.user });
  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}