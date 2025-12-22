import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Використовуємо Service Role Key для адмінських дій, або Anon Key для звичайних
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Отримуємо locale з тіла запиту (переконайся, що фронтенд її відправляє)
    const { email, password, full_name, locale } = await req.json();

    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin; // Автоматично визначає localhost або домен

    const userLocale = locale || 'uk';

    // 2. Реєстрація
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        // КЛЮЧОВИЙ МОМЕНТ: додаємо ?locale=...
        emailRedirectTo: `${origin}/api/auth/callback?locale=${userLocale}`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: data.user,
    });
  } catch (e) {
    console.error('SIGNUP API ERROR:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
