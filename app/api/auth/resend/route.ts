import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Отримуємо lang разом з email
    const { email, lang } = await req.json();

    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin;

    // 2. Встановлюємо локаль
    const userLocale = lang || 'uk';

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup', // Для повторного підтвердження це правильний тип
      email,
      password: 'dummy-password',
      options: {
        // 3. ВАЖЛИВО:
        // - Ведемо на /api/auth/callback (серверний обробник)
        // - Передаємо next=/profile (куди йти після входу)
        // - Передаємо locale=${userLocale} (щоб зберегти мову)
        redirectTo: `${origin}/api/auth/callback?next=/profile&locale=${userLocale}`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { action_link } = data.properties;

    // === ДИНАМІЧНИЙ ЛИСТ (як ми робили раніше) ===
    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject:
        userLocale === 'en'
          ? 'Verify your email (Resend)'
          : 'Підтвердження пошти (Повторно)',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
             <h2>${
               userLocale === 'en'
                 ? 'Email Verification'
                 : 'Підтвердження пошти'
             }</h2>
             <p>${
               userLocale === 'en'
                 ? 'You requested a new verification email. Please click the button below.'
                 : 'Ви запросили новий лист підтвердження. Натисніть кнопку нижче.'
             }</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${action_link}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              ${userLocale === 'en' ? 'Confirm Email' : 'Підтвердити пошту'}
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
           <p style="text-align: center; font-size: 12px; color: #999;">
             ${
               userLocale === 'en'
                 ? 'If you did not request this, ignore this email.'
                 : 'Якщо ви не робили цей запит, просто проігноруйте цей лист.'
             }
          </p>
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
