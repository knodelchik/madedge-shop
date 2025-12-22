import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // 1. ЛОГУВАННЯ (Дивись логи Vercel)
  console.log('🔹 CALLBACK STARTED:', request.url);

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
              // Ігноруємо помилку setAll у Server Component
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const cleanNext = next.startsWith('/') ? next : `/${next}`;
      // Формуємо фінальний URL
      const finalUrl = `${origin}/${locale}${cleanNext}`;

      console.log('✅ LOGIN SUCCESS. Redirecting to:', finalUrl);
      return NextResponse.redirect(finalUrl);
    } else {
      console.error('❌ AUTH ERROR:', error.message);
    }
  } else {
    console.error('❌ NO CODE FOUND in URL');
  }

  // Якщо помилка - на сторінку помилки
  return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
}
