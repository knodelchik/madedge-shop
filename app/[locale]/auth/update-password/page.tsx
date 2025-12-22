'use client';

import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase-client'; // Імпортуй клієнт

export default function UpdatePasswordPage() {
  const t = useTranslations('UpdatePassword');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Додаємо стан перевірки сесії
  const [checkingSession, setCheckingSession] = useState(true);

  // ЕФЕКТ ЗАХИСТУ
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Немає сесії - викидаємо на вхід
        router.replace('/auth?view=signin');
      } else {
        // Є сесія - показуємо форму
        setCheckingSession(false);
      }
    };
    checkUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authService.updatePassword(password);

    if (error) {
      toast.error(t('error'));
    } else {
      toast.success(t('success'));
      router.push('/profile');
    }
    setLoading(false);
  };

  // Поки перевіряємо - крутимо лоадер
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 transition-colors duration-300">
      {/* ... Твій існуючий JSX форми ... */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Lock size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          {t('title')}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          {t('description')}
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder={t('placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full p-3 border border-gray-200 rounded-xl bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white dark:bg-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? t('buttonLoading') : t('button')}
          </button>
        </form>
      </div>
    </div>
  );
}
