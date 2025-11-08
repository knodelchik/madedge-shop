'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

// 1. Імпортуємо motion ТА Variants з framer-motion
import { motion, Variants } from 'framer-motion';

const Threads = dynamic(() => import('../../components/Threads'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 dark:bg-black animate-pulse" />
  ),
});

// 2. Визначаємо варіанти анімації та явно типізуємо їх
const containerVariants: Variants = {
  // <-- Використовуємо : Variants
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  // <-- Використовуємо : Variants
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function Main() {
  const t = useTranslations('Main');

  return (
    <main className="w-full h-full relative">
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Фон Threads, завантажується лише на клієнті */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full">
          <Threads amplitude={1.2} distance={0.0001} color={[1, 1, 1]} />
        </div>

        <motion.div
          className="flex flex-col items-center justify-center text-center z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors duration-300"
            variants={itemVariants}
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-700 dark:text-neutral-300 max-w-2xl mb-10 transition-colors duration-300"
            variants={itemVariants}
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            id="our-products"
            className="flex justify-center gap-5 py-16 mr-3"
            variants={itemVariants}
          >
            {/* Посилання на Shop */}
            <Link href="/shop" passHref>
              <Button
                asChild
                size="lg"
                className="px-8 py-4 rounded-2xl border border-gray-400/10 dark:border-neutral-300 shadow-md cursor-pointer hover:bg-gray-300/30 dark:hover:bg-neutral-700/30 dark:hover:border-neutral-400 hover:text-black dark:hover:text-white transition duration-200"
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
                className="px-10 py-4 rounded-2xl shadow-md cursor-pointer bg-gray-300/30 dark:bg-neutral-700/30 border border-gray-400/10 text-gray-900 dark:text-white hover:text-black/80 dark:hover:text-white/80 dark:hover:bg-neutral-900 dark:border-neutral-900 dark:hover:border-neutral-800 transition duration-200"
              >
                <span>{t('about')}</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
