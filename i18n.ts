// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'uk'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Очікуємо (await) отримання локалі
  const locale = await requestLocale;

  // Перевірка валідності
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
