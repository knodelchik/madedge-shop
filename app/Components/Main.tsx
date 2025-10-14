'use client';

import Threads from '../../components/Threads';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translation/translations';

export default function Main() {
  const { language } = useLanguage();
  const t = translations[language]; // переклади під мову

  return (
    <main className="w-full h-full relative">
      <section className="relative h-[100vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Фон Threads */}
        <div className="absolute -z-1 top-0 left-0 w-full h-full">
          <Threads
            amplitude={1.2}
            distance={0.0001}
            color={[1, 1, 1]}
          />
        </div>

        {/* Текст */}
        <h1 className="text-6xl font-extrabold text-black mb-6">
          {t.heroTitle}
        </h1>
        <p className="text-2xl text-black max-w-2xl mb-10">{t.heroSubtitle}</p>

        <div className="flex justify-center gap-6 py-16">
          <Link href="/shop" passHref>
            <Button
              asChild
              size="lg"
              className="px-8 py-4 rounded-2xl border border-black shadow-md cursor-pointer z-10 hover:bg-gray-300/30 hover:border-gray-400/10 hover:text-black transition duration-200"
            >
              <span>{t.shop}</span>
            </Button>
          </Link>

          <Link href="/about" passHref>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-8 py-4 rounded-2xl shadow-md cursor-pointer z-10 bg-gray-300/30 border border-gray-400/10 text-black hover:text-black/80 transition duration-200"
            >
              <span>{t.about}</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
