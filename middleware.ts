import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ua'],
  defaultLocale: 'ua',
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  // 1. Запускаємо локалізацію
  let response = intlMiddleware(request);

  // 2. Створюємо Supabase клієнт для роботи з куками
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Оновлюємо куки в запиті
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          // Оновлюємо куки у відповіді (щоб збереглись у браузері)
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Оновлюємо сесію користувача
  // Це найважливіший рядок: він гарантує, що Auth токен свіжий
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ['/', '/(ua|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};