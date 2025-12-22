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
  // 1. Ігноруємо системні файли
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Локалізація
  const response = intlMiddleware(request);

  // 3. Supabase клієнт
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 4. Перевірка користувача
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // === ЗАХИСТ МАРШРУТІВ ===
  if (request.nextUrl.pathname.includes('/auth/update-password')) {
    if (!user) {
      // Визначаємо локаль з шляху (наприклад /uk/auth... -> uk)
      const pathname = request.nextUrl.pathname;
      const pathLocale =
        locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;

      const url = request.nextUrl.clone();
      url.pathname = `/${pathLocale}/auth`;
      url.searchParams.set('view', 'signin');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
