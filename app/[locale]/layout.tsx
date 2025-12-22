import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { CurrencyProvider } from '@/app/context/CurrencyContext';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer';
import AuthErrorListener from '../Components/AuthErrorListener'; // 1. Імпорт слухача помилок
import '@/app/globals.css';
import type { Metadata } from 'next';

const locales = ['en', 'uk'] as const;
type Locale = (typeof locales)[number];

// SEO та Метадані
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    uk: 'MadEdge - Професійне заточування',
    en: 'MadEdge - Professional Sharpening',
  };
  const descriptions: Record<Locale, string> = {
    uk: 'Все для професійного заточування інструментів',
    en: 'Everything for professional tool sharpening',
  };

  return {
    title: titles[locale as Locale] || titles.uk,
    description: descriptions[locale as Locale] || descriptions.uk,
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {/* 2. Слухач помилок тут. Він невидимий, але працює на всіх сторінках */}
              <AuthErrorListener />

              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Toaster richColors position="top-left" />
                <Footer />
              </div>
            </NextIntlClientProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
