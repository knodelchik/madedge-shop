'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import useWindowSize from '../hooks/useWindowSize';


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
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('Main');
  const { width } = useWindowSize();
  const isTablet = width <= 800;

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <main className="w-full h-full relative">
      <section
        className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden   /* телефони */
sm:pt-24     /* планшети */
lg:pt-0      /* ПК — як було */
"
      >
        {/* Фон Threads, завантажується лише на клієнті */}
        {isClient && !isTablet && (<div className="absolute -z-10 top-0 left-0 w-full h-full">
          <Threads amplitude={1.2} distance={0.0001} color={[1, 1, 1]} />
        </div>)}


        <motion.div
          className="flex flex-col items-center justify-center text-center z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="
    text-5xl        /* мобільний */
    sm:text-6xl     /* починаючи з планшета — оригінальний розмір, ПК не чіпаємо */

    font-extrabold text-gray-900 dark:text-white mb-6 transition-colors duration-300
  "
            variants={itemVariants}
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            className="
    text-base       /* мобільний трохи менший */
    sm:text-2xl     /* починаючи з планшета повертається оригінальний розмір */

    text-gray-700 dark:text-neutral-300 max-w-2xl mb-10 transition-colors duration-300
   
  "
            variants={itemVariants}
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* ===== ЗМІНЕНО ТУТ ===== */}
          <motion.div
            id="our-products"
            /* Використовуємо grid, задаємо gap-5 і обмежуємо ширину */
            className="grid grid-cols-2 gap-5 py-16 w-full max-w-sm  mt-10
    sm:-mt-14
    lg:mt-0" // Можете погратися з max-w-xs (320px) або max-w-sm (384px)
            variants={itemVariants}
          >
            <div className="flex justify-end">
              <Link href="/shop" passHref>
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl border border-gray-400/10 dark:border-neutral-300 shadow-md cursor-pointer hover:bg-gray-300/30 dark:hover:bg-neutral-700/30 dark:hover:border-neutral-400 hover:text-black dark:hover:text-white transition duration-200 px-10 py-5     /* більше падінги на мобільних і планшетах */
sm:px-12 sm:py-6
md:px-14 md:py-7

lg:px-8 lg:py-4  
text-md         /* мобільний */
sm:text-xl       /* планшет */
md:text-2xl      /* великий планшет */

lg:text-sm     /* на ПК повертаємо оригінальний розмір */

"
                >
                  <span>{t('shop')}</span>
                </Button>
              </Link>
            </div>

            <div className="flex justify-start ">
              <Link href="/about" passHref>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-2xl shadow-md cursor-pointer bg-gray-300/30 dark:bg-neutral-700/30 border border-gray-400/10 text-gray-900 dark:text-white hover:text-black/80 dark:hover:text-white/80 dark:hover:bg-neutral-900 dark:border-neutral-900 dark:hover:border-neutral-800 transition duration-200 px-10 py-5     /* більше падінги на мобільних і планшетах */
sm:px-12 sm:py-6
md:px-14 md:py-7

lg:px-8 lg:py-4 
text-md          /* мобільний */
sm:text-xl       /* планшет */
md:text-2xl      /* великий планшет */

lg:text-sm     /* на ПК повертаємо оригінальний розмір */

"
                >
                  <span>{t('about')}</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
