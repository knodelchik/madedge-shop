import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Отримуємо lang з фронтенду
    const { email, password, full_name, lang } = await req.json();
    const origin = new URL(req.url).origin;

    // Створення юзера...
    const { data: user, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name },
        email_confirm: false,
      });

    if (createError)
      return NextResponse.json({ error: createError.message }, { status: 400 });
    if (!user.user)
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );

    // Генерація посилання...
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email,
        password,
        options: { redirectTo: `${origin}/profile` },
      });

    if (linkError)
      return NextResponse.json({ error: linkError.message }, { status: 400 });

    const { action_link } = linkData.properties;

    // 2. ЛОГІКА ВИБОРУ МОВИ
    const isEng = lang === 'en';

    const subject = isEng
      ? 'Confirm your registration - MadEdge'
      : 'Підтвердження реєстрації MadEdge';
    const title = isEng
      ? `Welcome, ${full_name}!`
      : `Ласкаво просимо, ${full_name}!`;
    const textMain = isEng
      ? 'Thanks for joining MadEdge. Please confirm your email:'
      : 'Дякуємо за реєстрацію в MadEdge. Будь ласка, підтвердіть вашу пошту:';
    const buttonText = isEng ? 'Confirm Email' : 'Підтвердити пошту';

    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>${title}</h1>
          <p>${textMain}</p>
          <br/>
          <a href="${action_link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">${buttonText}</a>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true, user: user.user });
  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
