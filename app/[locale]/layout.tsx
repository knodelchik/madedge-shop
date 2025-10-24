import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { CurrencyProvider } from '@/app/context/CurrencyContext';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer';
import '@/app/globals.css'; // ✅ Додай імпорт стилів

const locales = ['en', 'ua'] as const;
type Locale = (typeof locales)[number];

// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    ua: 'MadEdge - Професійне заточування',
    en: 'MadEdge - Professional Sharpening',
  };
  const descriptions: Record<Locale, string> = {
    ua: 'Все для професійного заточування інструментів',
    en: 'Everything for professional tool sharpening',
  };

  return {
    title: titles[locale as Locale] || titles.ua,
    description: descriptions[locale as Locale] || descriptions.ua,
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
