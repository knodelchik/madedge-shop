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
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Фон Threads */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Threads
            amplitude={0.4}
            distance={0.001}
            enableMouseInteraction={true}
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
              className="px-8 py-4 rounded-2xl shadow-md cursor-pointer z-10"
            >
              <span>{t.shop}</span>
            </Button>
          </Link>

          <Link href="/about" passHref>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-8 py-4 rounded-2xl shadow-md cursor-pointer z-10"
            >
              <span>{t.about}</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
