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
    // 1. Отримуємо lang разом з email
    // Якщо фронтенд не передав мову, за замовчуванням 'en'
    const { email, lang = 'en' } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 2. Зберігаємо email ТА мову в базу
    const { error: dbError } = await supabase.from('subscribers').insert([
      {
        email,
        lang: lang, // Зберігаємо мову для майбутніх розсилок
      },
    ]);

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 200 }
        );
      }
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 3. Підготовка тексту листа
    // ЗАГОТОВКА НА МАЙБУТНЄ:
    // const isUk = lang === 'uk';
    // const subject = isUk ? 'Вітаємо в MadEdge!' : 'Welcome to MadEdge Community!';
    // const title = isUk ? 'Дякуємо за підписку! 🎉' : 'Thanks for subscribing! 🎉';

    // ПОКИ ЩО (Тільки англійська, як ви просили):
    const subject = 'Welcome to MadEdge Community!';
    const title = 'Thanks for subscribing! 🎉';
    const textMain =
      'You have successfully subscribed to <strong>MadEdge</strong> news.';
    const textSub =
      'We will notify you about new products, promotions, and useful sharpening tips.';
    const footer = 'Best regards,<br/>MadEdge Team';

    // 4. Відправляємо лист
    const msg = {
      to: email,
      from: 'info@madedge.net', // Ваш верифікований домен
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
