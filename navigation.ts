import { createNavigation } from 'next-intl/navigation';
// або, якщо вам потрібні локалізовані pathnames:
// import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';

export const { Link, usePathname, useRouter, redirect } = createNavigation({
  locales: ['en', 'ua'],
  defaultLocale: 'ua',
});
