// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { translations } from '@/lib/translations';
import { notFound } from 'next/navigation';

const locales = ['en', 'ua'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: translations[locale as keyof typeof translations],
  };
});
