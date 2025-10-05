import type { Metadata } from 'next';
import './globals.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';

export const metadata: Metadata = {
  title: 'MadEdge - Професійне заточування',
  description: 'Все що потрібно для професійного заточування інструментів',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <CurrencyProvider>
              <Header />
              <main>{children}</main>
              <Toaster richColors position="top-left" />
              <Footer />
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}