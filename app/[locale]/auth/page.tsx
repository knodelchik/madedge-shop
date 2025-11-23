'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../Components/AuthForm';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService'; // Імпортуємо сервіс
import { toast } from 'sonner';
import { useTranslations } from 'next-intl'; // Додаємо переклади
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function AuthPage() {
  // Розширюємо типи станів
  const [authType, setAuthType] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  const [emailForReset, setEmailForReset] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('Auth'); // Припускаємо, що у вас є namespace 'Auth'

  const handleSuccess = () => {
    router.push('/profile');
  };

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  // Логіка відновлення паролю
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authService.resetPasswordForEmail(emailForReset);

    if (error) {
      toast.error('Помилка: ' + error);
    } else {
      toast.success('Посилання надіслано! Перевірте пошту.');
      setAuthType('signin'); // Повертаємо на вхід
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
                  Забули пароль?
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Введіть вашу електронну пошту, і ми надішлемо вам інструкції для відновлення.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="sr-only">Email</label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="name@example.com"
                      value={emailForReset}
                      onChange={(e) => setEmailForReset(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Надсилання...' : 'Надіслати посилання'}
                  </button>
                </form>

                <button
                  onClick={() => setAuthType('signin')}
                  className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  Повернутися до входу
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
                <AuthForm
                  type={authType}
                  onSuccess={handleSuccess}
                  onToggleType={toggleAuthType}
                  // Додаємо новий проп, щоб AuthForm міг перемкнути нас на відновлення
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