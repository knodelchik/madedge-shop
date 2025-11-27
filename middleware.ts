import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'uk'],
  defaultLocale: 'uk',
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  // 1. ПЕРЕВІРКА НА API ТА СТАТИКУ (КРИТИЧНО ВАЖЛИВО ДЛЯ FONDY)
  // Якщо запит йде на /api/..., /_next/..., або це файл (зображення, css) — пропускаємо middleware
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') // Перевірка на розширення файлу (.png, .css)
  ) {
    return NextResponse.next();
  }

  // 2. Запускаємо локалізацію (тільки для сторінок)
  let response = intlMiddleware(request);

  // 3. Створюємо Supabase клієнт (тільки для сторінок)
  // Це не "важка" операція, це просто ініціалізація класу
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

  // 4. Оновлюємо сесію (важливо для Auth, щоб не вилогінювало)
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Matcher залишаємо широким, але ми вже відфільтрували зайве через if на початку функції
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};