'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const t = useTranslations('AuthConfirm');
  const router = useRouter();

  useEffect(() => {
    // Автоматичний редірект через 3 секунди
    const timer = setTimeout(() => {
      router.push('/profile');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle2 size={48} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('success.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('success.message')}
          </p>
        </div>

        <button
          onClick={() => router.push('/profile')}
          className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          {t('button')}
        </button>
      </div>
    </div>
  );
}
