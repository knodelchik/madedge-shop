'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthForm from '../../Components/AuthForm';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl'; // 1. Імпорт useLocale
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale(); // 2. Отримуємо поточну мову ('uk' або 'en')

  // Перевіряємо URL параметр ?view=signup
  const initialView =
    searchParams.get('view') === 'signup' ? 'signup' : 'signin';

  const [authType, setAuthType] = useState<
    'signin' | 'signup' | 'forgot-password'
  >(initialView);

  const [emailForReset, setEmailForReset] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'signup') setAuthType('signup');
    else if (view === 'signin') setAuthType('signin');
  }, [searchParams]);

  const t = useTranslations('Auth');

  const handleSuccess = () => {
    router.push('/profile');
  };

  const toggleAuthType = () => {
    const newType = authType === 'signin' ? 'signup' : 'signin';
    setAuthType(newType);
  };

  // === ЛОГІКА ВІДНОВЛЕННЯ ПАРОЛЮ ===
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 3. Передаємо locale (мову) другим параметром
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
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
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
              // === ЗВИЧАЙНА ФОРМА ===
              <motion.div
                key={authType}
                initial={{ opacity: 0, x: authType === 'signin' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: authType === 'signin' ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {/* AuthForm всередині вже має логіку useLocale, тому просто рендеримо */}
                <AuthForm
                  type={authType}
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
