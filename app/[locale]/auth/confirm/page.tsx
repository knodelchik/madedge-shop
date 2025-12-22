'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthConfirm() {
  const router = useRouter();
  const t = useTranslations('AuthConfirm');
  const [status, setStatus] = useState<'success'>('success'); // Одразу успіх, бо API вже спрацювало

  useEffect(() => {
    // Просто чекаємо 3 секунди і кидаємо в профіль
    // Бо якщо ми тут - значить callback/route.ts вже відпрацював без помилок
    const timer = setTimeout(() => {
      router.push('/profile');
      // router.refresh(); // Можна розкоментувати, якщо дані профілю не підтягуються одразу
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6 p-10 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-neutral-800"
      >
        <div className="mx-auto w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500">
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('success.title')}
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 leading-relaxed">
            {t('success.message')}
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => router.push('/profile')}
            className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
          >
            {t('button')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
