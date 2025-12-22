import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, password, full_name, locale } = await req.json();

    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin;
    const userLocale = locale || 'uk';

    // 1. Створюємо юзера
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

    // 2. Генеруємо посилання
    // ВАЖЛИВО: redirectTo веде на КЛІЄНТСЬКУ сторінку confirm.
    // Це дозволяє браузеру спіймати хеш (#) до того, як сервер його загубить.
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email,
        password,
        options: {
          redirectTo: `${origin}/${userLocale}/auth/confirm`,
        },
      });

    if (linkError)
      return NextResponse.json({ error: linkError.message }, { status: 400 });

    const { action_link } = linkData.properties;

    // 3. Твій лист (Дизайн з двома мовами)
    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject: 'Confirm your registration / Підтвердження реєстрації',
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          
          <div style="text-align: center; margin-bottom: 30px;">
             <h2 style="margin-top: 0; color: #000;">Welcome to MadEdge!</h2>
             <p style="font-size: 16px; color: #555;">
               Thanks for joining us. Please confirm your email address to activate your account.
             </p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${action_link}" style="background-color: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              Confirm Email / Підтвердити
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 40px 0;" />

          <div style="text-align: center;">
            <h2 style="margin-top: 0; color: #000;">Вітаємо в MadEdge!</h2>
            <p style="font-size: 16px; color: #555;">
              Дякуємо за реєстрацію. Будь ласка, підтвердіть вашу електронну пошту, щоб активувати акаунт.
            </p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
    return NextResponse.json({ success: true, user: user.user });
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
