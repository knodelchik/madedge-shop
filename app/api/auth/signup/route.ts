import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, password, full_name, locale } = await req.json(); // Додаємо locale

    const requestUrl = new URL(req.url);
    const origin =
      requestUrl.hostname === 'localhost'
        ? requestUrl.origin
        : 'https://madedge.net';

    // Визначаємо локаль (за замовчуванням 'uk')
    const userLocale = locale || 'uk';

    // Створення юзера
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

    // Генерація лінка з правильним шляхом (включаючи locale)
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email,
        password,
        options: {
          // ВИПРАВЛЕННЯ: додаємо locale в шлях
          redirectTo: `${origin}/${userLocale}/auth/callback?next=/profile`,
        },
      });

    if (linkError)
      return NextResponse.json({ error: linkError.message }, { status: 400 });

    const { action_link } = linkData.properties;

    // Двомовний лист
    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject: 'Confirm your registration / Підтвердження реєстрації',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="margin-bottom: 20px;">
            <h2 style="margin-top: 0;">Welcome to MadEdge!</h2>
            <p>Thanks for joining us. Please confirm your email address to activate your account.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${action_link}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              Confirm Email / Підтвердити пошту
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <div>
            <h2 style="margin-top: 0;">Вітаємо в MadEdge!</h2>
            <p>Дякуємо за реєстрацію. Будь ласка, підтвердіть вашу електронну пошту, щоб активувати акаунт.</p>
          </div>
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
