import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nekrasovss@gmail.com';

export async function POST(req: Request) {
  try {
    const { rating, feedback, pageUrl } = await req.json();

    // 1. Зберігаємо в базу даних
    const { error: dbError } = await supabase.from('feedbacks').insert([
      {
        rating,
        comment: feedback,
        page_url: pageUrl,
      },
    ]);

    if (dbError) {
      console.error('DB Error:', dbError);
      // Не зупиняємось, пробуємо хоча б відправити лист
    }

    // 2. Визначаємо смайлик для теми листа
    const emojis = ['😢', '🙁', '🙂', '🤩'];
    const selectedEmoji = emojis[rating - 1] || '🤔';

    // 3. Відправляємо лист адміну
    const msg = {
      to: ADMIN_EMAIL,
      from: 'info@madedge.net',
      subject: `Новий відгук ${selectedEmoji} (Оцінка: ${rating}/4)`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2>Новий фідбек з сайту</h2>
          <p><strong>Оцінка:</strong> ${rating} / 4 ${selectedEmoji}</p>
          <p><strong>Сторінка:</strong> <a href="${pageUrl}">${pageUrl}</a></p>
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
