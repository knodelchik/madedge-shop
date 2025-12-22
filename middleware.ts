import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, localePrefix } from './config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export default async function middleware(request: NextRequest) {
  // 1. Ігноруємо API та статичні файли
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Спочатку запускаємо локалізацію (щоб мати правильний response)
  const response = intlMiddleware(request);

  // 3. Створюємо Supabase клієнт для Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 4. Отримуємо користувача (оновлюємо сесію)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // === ЗАХИСТ МАРШРУТІВ ===

  // Перевіряємо, чи намагається юзер зайти на сторінку зміни пароля
  // (вона може бути /uk/auth/update-password або /en/auth/update-password)
  if (request.nextUrl.pathname.includes('/auth/update-password')) {
    // Якщо користувача немає (незалогінений) — кидаємо на вхід
    if (!user) {
      const locale = request.nextUrl.locale || defaultLocale;
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/auth`;
      url.searchParams.set('view', 'signin');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
