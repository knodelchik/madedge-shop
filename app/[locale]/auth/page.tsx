'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthForm from '../../Components/AuthForm';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  // Стан для відображення лоадера, поки перевіряємо сесію
  const [checkingSession, setCheckingSession] = useState(true);

  const initialView =
    searchParams.get('view') === 'signup' ? 'signup' : 'signin';

  const [authType, setAuthType] = useState<
    'signin' | 'signup' | 'forgot-password'
  >(initialView);

  const [emailForReset, setEmailForReset] = useState('');
  const [loading, setLoading] = useState(false);

  const t = useTranslations('Auth');

  // === 1. ВИПРАВЛЕНА ЛОГІКА ПЕРЕВІРКИ СЕСІЇ ===
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Якщо сесія Є -> йдемо в профіль
        router.replace('/profile');
      } else {
        // Якщо сесії НЕМАЄ -> показуємо форму (вимикаємо лоадер)
        setCheckingSession(false);
      }
    };
    checkUser();
  }, [router]);

  // Синхронізація URL параметрів
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'signup' && authType !== 'signup') setAuthType('signup');
    else if (view === 'signin' && authType !== 'signin') setAuthType('signin');
  }, [searchParams, authType]);

  const handleSuccess = () => {
    router.push('/profile');
  };

  const toggleAuthType = () => {
    const newType = authType === 'signin' ? 'signup' : 'signin';
    setAuthType(newType);

    // Оновлюємо URL без перезавантаження
    const newUrl = `/auth?view=${newType}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authService.resetPasswordForEmail(
      emailForReset,
      locale
    );

    if (error) {
      toast.error(t('errorPrefix') + error);
    } else {
      toast.success(t('resetLinkSent'));
      setAuthType('signin');
      setEmailForReset('');
    }
    setLoading(false);
  };

  // Показуємо спінер, поки Supabase перевіряє сесію
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-black py-12 transition-colors duration-300 flex items-center justify-center"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="max-w-md mx-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-lg dark:shadow-xl transition-colors duration-300 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {authType === 'forgot-password' ? (
              // === ФОРМА ВІДНОВЛЕННЯ ПАРОЛЮ ===
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-50 dark:bg-neutral-800 rounded-full text-blue-600 dark:text-blue-400">
                    <KeyRound size={28} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                  {t('forgotPasswordTitle')}
                </h2>

                <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  {t('forgotPasswordDesc')}
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      value={emailForReset}
                      onChange={(e) => setEmailForReset(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? t('sending') : t('sendResetLink')}
                  </button>
                </form>

                <button
                  onClick={() => setAuthType('signin')}
                  className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  {t('backToSignIn')}
                </button>
              </motion.div>
            ) : (
              // === ЗВИЧАЙНА ФОРМА (ВХІД / РЕЄСТРАЦІЯ) ===
              <motion.div
                key={authType}
                initial={{ opacity: 0, x: authType === 'signin' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: authType === 'signin' ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {/* 2. ВИПРАВЛЕНА ПОМИЛКА TYPESCRIPT:
                   Ми вже в блоці 'else', тому authType точно не 'forgot-password'.
                   Ми приводимо тип явно, щоб задовольнити TS.
                */}
                <AuthForm
                  type={authType as 'signin' | 'signup'}
                  onSuccess={handleSuccess}
                  onToggleType={toggleAuthType}
                  onForgotPassword={() => setAuthType('forgot-password')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
