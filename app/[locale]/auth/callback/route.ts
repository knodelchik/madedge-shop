import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const locale = searchParams.get('locale') || 'uk';
  const next = searchParams.get('next') || '/profile';

  if (code) {
    const cookieStore = await cookies();

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
              // Ігноруємо
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const cleanNext = next.startsWith('/') ? next : `/${next}`;
      return NextResponse.redirect(`${origin}/${locale}${cleanNext}`);
    } else {
      console.error('Callback auth error:', error.message);
      // Якщо помилка обміну коду
      return NextResponse.redirect(
        `${origin}/${locale}/auth/auth-code-error?error=exchange_failed`
      );
    }
  }

  // 🔥 ВИПРАВЛЕННЯ: Додаємо параметр error, щоб сторінка помилки не кидала на головну
  return NextResponse.redirect(
    `${origin}/${locale}/auth/auth-code-error?error=no_code_received`
  );
}
