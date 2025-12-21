import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nekrasovss@gmail.com';

export async function POST(req: Request) {
  try {
    // 1. Отримуємо нові поля name та email
    const { rating, feedback, pageUrl, name, email } = await req.json();

    // 2. Зберігаємо в базу даних (включно з ім'ям та поштою)
    const { error: dbError } = await supabase.from('feedbacks').insert([
      {
        rating,
        comment: feedback,
        page_url: pageUrl,
        user_name: name, // Нове поле
        user_email: email, // Нове поле
      },
    ]);

    if (dbError) {
      console.error('DB Error:', dbError);
    }

    // 3. Формуємо лист
    const emojis = ['😢', '🙁', '🙂', '🤩'];
    const selectedEmoji = emojis[rating - 1] || '🤔';

    // Блок інформації про користувача для листа
    const userInfoHtml = email
      ? `<p><strong>Користувач:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>`
      : `<p><strong>Користувач:</strong> Анонім</p>`;

    const msg = {
      to: ADMIN_EMAIL,
      from: 'info@madedge.net',
      subject: `Новий відгук ${selectedEmoji} (Оцінка: ${rating}/4)`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2>Новий фідбек з сайту</h2>
          
          <div style="background-color: #f0fdf4; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            ${userInfoHtml}
            <p style="margin-top: 5px;"><strong>Оцінка:</strong> ${rating} / 4 ${selectedEmoji}</p>
            <p><strong>Сторінка:</strong> <a href="${pageUrl}">${pageUrl}</a></p>
          </div>

          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          
          <h3>Коментар:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
            ${feedback || 'Без текстового коментаря'}
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Feedback API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
