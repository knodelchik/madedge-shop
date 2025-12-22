'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase-client';

export default function AuthConfirm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('AuthConfirm');

  // Явно вказуємо типи, щоб TypeScript був щасливий
  const [status, setStatus] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient();

      // 1. СЦЕНАРІЙ: Серверний код (?code=...)
      const code = searchParams.get('code');
      if (code) {
        const locale = window.location.pathname.split('/')[1] || 'uk';
        router.replace(
          `/api/auth/callback?code=${code}&locale=${locale}&next=/profile`
        );
        return;
      }

      // 2. СЦЕНАРІЙ: Клієнтський хеш (#access_token=...)
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        try {
          const hashParams = new URLSearchParams(hash.substring(1));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (!error) {
              setStatus('success');
              // Чекаємо 1.5 секунди, щоб юзер побачив галочку
              setTimeout(() => {
                router.push('/profile');
                router.refresh();
              }, 1500);
              return;
            }
          }
        } catch (e) {
          console.error('Hash auth error:', e);
        }
      }

      // 3. СЦЕНАРІЙ: "Зайвий пасажир" (перевірка існуючої сесії)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace('/profile');
      } else {
        router.replace('/auth?view=signin');
      }
    };

    handleAuth();
  }, [router, searchParams]);

  // === ВІДОБРАЖЕННЯ ===

  // 1. СТАН ЗАВАНТАЖЕННЯ
  // (Показується поки йде перевірка або "тихий" редірект)
  if (status !== 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white dark:bg-neutral-950">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-12 h-12 text-black dark:text-white animate-spin mb-4" />
          <p className="text-gray-500">{t('verifying')}</p>
        </div>
      </div>
    );
  }

  // 2. СТАН УСПІХУ
  // (Показується ТІЛЬКИ якщо ми реально підтвердили пошту через хеш)
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
          <p className="text-sm text-gray-400 animate-pulse">
            {t('redirecting')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
