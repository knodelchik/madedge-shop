import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin'; // Використовуємо твій перевірений клієнт
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, password, full_name, locale } = await req.json();

    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin; // Автоматично визначає http://localhost:3000 або https://madedge.net

    // Якщо локаль не прийшла, ставимо 'uk'
    const userLocale = locale || 'uk';

    // 1. Створюємо юзера (без підтвердження пошти, щоб він не отримав дефолтний лист від Supabase)
    const { data: user, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name },
        email_confirm: false,
      });

    if (createError) {
      console.error('Create User Error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    if (!user.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    // 2. Генеруємо посилання (Invite або Signup)
    // Використовуємо 'invite' або 'signup'.
    // 'signup' іноді глючить з редіректами, тому 'invite' надійніше для PKCE
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email,
        password,
        options: {
          // ОСЬ ТУТ МАГІЯ: додаємо ?locale=... у параметр redirectTo
          redirectTo: `${origin}/api/auth/callback?locale=${userLocale}`,
        },
      });

    if (linkError) {
      console.error('Generate Link Error:', linkError);
      return NextResponse.json({ error: linkError.message }, { status: 400 });
    }

    const { action_link } = linkData.properties;

    // 3. Відправляємо твій лист через SendGrid
    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject:
        userLocale === 'en'
          ? 'Confirm your registration'
          : 'Підтвердження реєстрації',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
             <h2>${
               userLocale === 'en'
                 ? 'Welcome to MadEdge!'
                 : 'Вітаємо в MadEdge!'
             }</h2>
             <p>${
               userLocale === 'en'
                 ? 'Thanks for joining us. Please confirm your email.'
                 : 'Дякуємо за реєстрацію. Будь ласка, підтвердіть вашу пошту.'
             }</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${action_link}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              ${userLocale === 'en' ? 'Confirm Email' : 'Підтвердити пошту'}
            </a>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true, user: user.user });
  } catch (error: any) {
    console.error('Signup API Error:', error); // Дивись цей лог у терміналі VS Code, якщо знову зависне!
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
