import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, lang } = await req.json();
    const origin = new URL(req.url).origin;

    // 1. Генеруємо посилання підтвердження
    // Тип 'signup' підходить для непідтверджених користувачів
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password: 'dummy-password', // Це формальність, пароль користувача не зміниться
      options: {
        redirectTo: `${origin}/profile`,
      },
    });

    if (error) {
      console.error('Generate Link Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { action_link } = data.properties;

    // 2. Логіка вибору мови
    const isEng = lang === 'en';

    const subject = isEng
      ? 'Verify your email - MadEdge'
      : 'Підтвердження пошти MadEdge';

    const title = isEng ? 'Email Verification' : 'Підтвердження пошти';

    const textMain = isEng
      ? 'You requested to resend the verification email. Click the button below to activate your account:'
      : 'Ви надіслали запит на повторне підтвердження пошти. Натисніть кнопку нижче, щоб активувати акаунт:';

    const buttonText = isEng ? 'Verify Email' : 'Підтвердити пошту';

    const textIgnore = isEng
      ? 'If you did not request this, simply ignore this email.'
      : 'Якщо ви не робили цей запит, просто проігноруйте цей лист.';

    // 3. Відправка через SendGrid
    const msg = {
      to: email,
      from: 'info@madedge.net', // Ваш верифікований відправник
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${title}</h2>
          <p>${textMain}</p>
          <br/>
          <a href="${action_link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">${buttonText}</a>
          <br/><br/>
          <p style="color: #666; font-size: 12px;">${textIgnore}</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Resend API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
