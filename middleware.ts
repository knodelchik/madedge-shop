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
  // 1. Ігноруємо системні файли та API (важливо для продуктивності)
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Створюємо відповідь через next-intl (це база для подальших змін)
  const response = intlMiddleware(request);

  // 3. Створюємо Supabase клієнт
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Оновлюємо куки у відповіді (щоб сесія зберігалася)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 4. Безпечна перевірка користувача (виправлено помилку)
  // Ми не робимо деструктуризацію одразу, щоб уникнути крашу
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  // Якщо є помилка (наприклад, токен протух), ми її просто ігноруємо тут,
  // бо user буде null, і перевірка нижче спрацює коректно.
  if (error) {
    // Можна додати логування, якщо треба, але зазвичай це не критично для middleware
    // console.log('Auth error:', error.message); 
  }

  // === ЗАХИСТ МАРШРУТІВ ===
  // Перевіряємо, чи намагається користувач зайти на захищену сторінку
  if (request.nextUrl.pathname.includes('/auth/update-password')) {
    if (!user) {
      // Визначаємо поточну мову з URL, щоб редірект був правильним
      const pathname = request.nextUrl.pathname;
      const pathLocale =
        locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;

      // Створюємо URL для перенаправлення
      const url = request.nextUrl.clone();
      url.pathname = `/${pathLocale}/auth`;
      url.searchParams.set('view', 'signin'); // Відкриваємо форму входу
      
      return NextResponse.redirect(url);
    }
  }

  // Повертаємо підготовлену відповідь (з локалізацією та оновленими куками)
  return response;
}

export const config = {
  // Matcher ігнорує статичні файли, щоб middleware не запускався зайвий раз
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};