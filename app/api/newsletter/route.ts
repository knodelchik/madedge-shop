import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Supabase Init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// SendGrid Init
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Отримуємо email та мову (за замовчуванням 'en')
    const { email, lang = 'en' } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 2. Зберігаємо в базу
    const { error: dbError } = await supabase.from('subscribers').insert([
      {
        email,
        lang: lang,
      },
    ]);

    if (dbError) {
      // Перевірка на унікальність (код помилки Postgres для unique violation - 23505)
      if (dbError.code === '23505') {
        // ВАЖЛИВО: Повертаємо 409 Conflict, щоб фронтенд знав, що це дублікат
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 409 }
        );
      }
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 3. ЛОГІКА МОВИ
    const isUk = lang === 'uk';

    const subject = isUk
      ? 'Вітаємо в MadEdge!'
      : 'Welcome to MadEdge Community!';

    const title = isUk
      ? 'Дякуємо за підписку! 🎉'
      : 'Thanks for subscribing! 🎉';

    const textMain = isUk
      ? 'Ви успішно підписалися на новини <strong>MadEdge</strong>.'
      : 'You have successfully subscribed to <strong>MadEdge</strong> news.';

    const textSub = isUk
      ? 'Ми будемо повідомляти вам про нові товари, акції та корисні поради із заточки.'
      : 'We will notify you about new products, promotions, and useful sharpening tips.';

    const footer = isUk
      ? 'З найкращими побажаннями,<br/>Команда MadEdge'
      : 'Best regards,<br/>MadEdge Team';

    // 4. Відправляємо лист
    const msg = {
      to: email,
      from: 'info@madedge.net', // Переконайтеся, що цей email верифікований у SendGrid
      subject: subject,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">${title}</h1>
          <p>${textMain}</p>
          <p>${textSub}</p>
          <br />
          <p>${footer}</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}