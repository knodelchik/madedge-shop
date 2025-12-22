import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const locale = searchParams.get('locale') || 'uk';
  const next = searchParams.get('next') || '/profile';

  if (code) {
    const cookieStore = await cookies();

    // Створюємо клієнт вручну, щоб мати контроль над методами set/setAll
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // Обмінюємо код на сесію.
    // Завдяки налаштуванню вище, Supabase запише токени в куки браузера.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Важливо: переконайся, що next починається зі слеша, щоб URL був коректним
      const cleanNext = next.startsWith('/') ? next : `/${next}`;

      // Редірект на потрібну сторінку
      return NextResponse.redirect(`${origin}/${locale}${cleanNext}`);
    } else {
      console.error('Callback auth error:', error.message);
    }
  }

  // Якщо коду немає або сталася помилка
  return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
}
