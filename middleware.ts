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

  // 1. ПЕРЕВІРКА НА API ТА СТАТИКУ (Ігноруємо ці шляхи)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Запускаємо локалізацію intl
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

  // 4. Отримуємо користувача та оновлюємо сесію
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. ЛОГІКА РЕДІРЕКТІВ

  // Якщо користувач залогінений і намагається зайти на сторінку підтвердження —
  // ДОЗВОЛЯЄМО йому там бути, щоб він побачив галочку
  if (user && pathname.includes('/auth/confirm')) {
    return response;
  }

  // Якщо користувач залогінений і заходить на основну сторінку входу —
  // перекидаємо в профіль
  if (user && pathname.match(/\/(uk|en)\/auth$/)) {
    const locale = pathname.split('/')[1] || 'uk';
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
