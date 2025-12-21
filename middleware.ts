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
  const pathname = request.nextUrl.pathname;

  // 1. Ігноруємо системні файли та API
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Ініціалізуємо локалізацію
  const response = intlMiddleware(request);

  // 3. Створюємо клієнт Supabase для Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 4. Отримуємо користувача та оновлюємо сесію
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Логіка редіректів

  // ДОЗВОЛЯЄМО бути на сторінці confirm, навіть якщо залогінений
  if (user && pathname.includes('/auth/confirm')) {
    return response;
  }

  // Якщо залогінений і намагається зайти на сторінку входу (/auth)
  const isAuthPage = pathname.endsWith('/auth') || pathname.endsWith('/auth/');
  if (user && isAuthPage) {
    const locale = pathname.split('/')[1] || 'uk';
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  // ЗАХИСТ ПРОФІЛЮ: Якщо НЕ залогінений і лізе в /profile
  if (!user && pathname.includes('/profile')) {
    const locale = pathname.split('/')[1] || 'uk';
    return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
