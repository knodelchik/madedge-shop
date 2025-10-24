// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ua'],
  defaultLocale: 'ua',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(ua|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
