'use client';

// 🌟 ВИПРАВЛЕННЯ ГІДРАТАЦІЇ: Використовуємо динамічний імпорт з ssr: false
// Це гарантує, що компонент Threads (який, ймовірно, використовує Canvas, Math.random()
// або window) рендериться ТІЛЬКИ на клієнті, уникаючи помилок гідратації.
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

const Threads = dynamic(() => import('../../components/Threads'), {
  ssr: false, // !!! Найважливіше для виправлення гідратації !!!
  loading: () => (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse" />
  ),
});

export default function Main() {
  const t = useTranslations('Main');

  // Використовуємо 100vh для заповнення екрана, але варто уникати
  // фіксованих висот, якщо це не Hero-секція.
  return (
    <main className="w-full h-full relative">
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Фон Threads, завантажується лише на клієнті */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full">
          {/* Компонент Threads тепер викликається, коли він буде доступний на клієнті.
            Він знаходиться за межами потоку документа (-z-10).
          */}
          <Threads amplitude={1.2} distance={0.0001} color={[1, 1, 1]} />
        </div>

        {/* Текст (залишається на передньому плані) */}
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-6 z-10">
          {t('heroTitle')}
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10 z-10">
          {t('heroSubtitle')}
        </p>

        <div className="flex justify-center gap-6 py-16 z-10">
          {/* Посилання на Shop */}
          <Link href="/shop" passHref>
            <Button
              asChild
              size="lg"
              className="px-8 py-4 rounded-2xl border border-black dark:border-white shadow-md cursor-pointer hover:bg-gray-300/30 dark:hover:bg-gray-700/30 hover:text-black dark:hover:text-white transition duration-200"
            >
              <span>{t('shop')}</span>
            </Button>
          </Link>

          {/* Посилання на About */}
          <Link href="/about" passHref>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-8 py-4 rounded-2xl shadow-md cursor-pointer bg-gray-300/30 dark:bg-gray-700/30 border border-gray-400/10 text-gray-900 dark:text-white hover:text-black/80 dark:hover:text-white/80 transition duration-200"
            >
              <span>{t('about')}</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
