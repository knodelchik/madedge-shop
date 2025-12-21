import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const origin = new URL(req.url).origin;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password: 'dummy-password',
      options: {
        redirectTo: `${origin}/profile`,
      },
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    const { action_link } = data.properties;

    // === ДВОМОВНИЙ ЛИСТ ===
    const msg = {
      to: email,
      from: 'info@madedge.net',
      subject: 'Verify your email / Підтвердження пошти',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          
          <div style="margin-bottom: 20px;">
            <h2 style="margin-top: 0;">Email Verification</h2>
            <p>Please click the button below to verify your email address and activate your account.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${action_link}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              Verify Email / Підтвердити пошту
            </a>
          </div>

          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />

          <div>
            <h2 style="margin-top: 0;">Підтвердження пошти</h2>
            <p>Будь ласка, натисніть кнопку вище, щоб підтвердити вашу електронну адресу та активувати акаунт.</p>
          </div>

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
