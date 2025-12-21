import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, lang } = await req.json(); // Отримуємо lang
    const origin = new URL(req.url).origin;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${origin}/auth/update-password` },
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    const { action_link } = data.properties;

    // ЛОГІКА МОВИ
    const isEng = lang === 'en';

    const subject = isEng
      ? 'Reset Password - MadEdge'
      : 'Відновлення паролю MadEdge';
    const title = isEng ? 'Password Recovery' : 'Відновлення паролю';
    const textMain = isEng
      ? 'You requested a password change. Click the button below to set a new password:'
      : 'Ви надіслали запит на зміну паролю. Натисніть кнопку нижче, щоб створити новий пароль:';
    const buttonText = isEng ? 'Change Password' : 'Змінити пароль';
    const textIgnore = isEng
      ? 'If you did not request this, simply ignore this email.'
      : 'Якщо ви не робили цей запит, просто проігноруйте цей лист.';

    const msg = {
      to: email,
      from: 'info@madedge.net',
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
