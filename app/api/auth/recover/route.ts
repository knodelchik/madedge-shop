import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Зчитуємо lang разом з email
    const { email, lang } = await req.json();
    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin;

    // 2. Визначаємо локаль (або те, що прийшло, або 'uk')
    const userLocale = lang || 'uk';

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        // 3. ВАЖЛИВО:
        // - Ведемо на /api/auth/callback
        // - Передаємо next=/auth/update-password (наша нова сторінка)
        // - Передаємо locale=${userLocale} (щоб зберегти мову)
        redirectTo: `${origin}/api/auth/callback?next=/auth/update-password&locale=${userLocale}`,
      },
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    const { action_link } = data.properties;

    // === ДВОМОВНИЙ ЛИСТ ===
    // (Трохи покращив тему листа, щоб вона теж залежала від мови, якщо хочеш)
    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject: userLocale === 'en' ? 'Reset Password' : 'Відновлення паролю',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="margin-bottom: 20px;">
            <h2 style="margin-top: 0;">Password Recovery</h2>
            <p>You requested a password change. Click the button below to set a new password.</p>
            <p style="font-size: 12px; color: #666;">If you did not request this, simply ignore this email.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${action_link}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              Change Password / Змінити пароль
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <div>
            <h2 style="margin-top: 0;">Відновлення паролю</h2>
            <p>Ви надіслали запит на зміну паролю. Натисніть кнопку вище, щоб створити новий пароль.</p>
            <p style="font-size: 12px; color: #666;">Якщо ви не робили цей запит, просто проігноруйте цей лист.</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
