'use client';

import { Link } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Mail, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

function AuthCodeErrorContent() {
  const t = useTranslations('AuthError');
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [hashParams, setHashParams] = useState<{
    error?: string;
    error_description?: string;
    error_code?: string;
  }>({});

  const [isClient, setIsClient] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // === СТАНИ ДЛЯ ПОВТОРНОЇ ВІДПРАВКИ ===
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const handleCheck = async () => {
      const supabase = createClient();

      // === 0. ГОЛОВНИЙ ФІКС: ПЕРЕВІРКА ТОКЕНА ===
      // Якщо в URL є #access_token (як на твоєму скріншоті), значить вхід відбувся успішно!
      // Ми просто ігноруємо відсутність коду і переходимо далі.
      if (
        typeof window !== 'undefined' &&
        window.location.hash.includes('access_token')
      ) {
        // Чекаємо мить, щоб Supabase розпарсив хеш
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          toast.success(t('successVerified') || 'Successfully verified!');
          // Редіректимо на зміну пароля, бо це найімовірніша дія
          router.replace('/auth/update-password');
          return;
        }
      }

      // 1. Зчитуємо параметри з URL (Query Params)
      let errorData = {
        error: searchParams.get('error'),
        desc: searchParams.get('error_description'),
        code: searchParams.get('error_code'),
      };

      // 2. Зчитуємо параметри з Хешу (Hash), якщо вони є
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        if (params.get('error') || params.get('error_code')) {
          errorData = {
            error: params.get('error') || errorData.error,
            desc: params.get('error_description') || errorData.desc,
            code: params.get('error_code') || errorData.code,
          };
        }
      }

      setHashParams({
        error: errorData.error || undefined,
        error_description: errorData.desc || undefined,
        error_code: errorData.code || undefined,
      });

      const hasError = !!errorData.error || !!errorData.code;

      if (!hasError) {
        // Якщо помилок немає взагалі, але є сесія - в профіль, інакше на головну
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.replace('/profile');
        } else {
          router.replace('/');
        }
        return;
      }

      // 3. ЛОГІКА "ХИБНОЇ ТРИВОГИ"
      // Додаємо сюди 'no_code_received'
      const isExpiredError =
        errorData.code === 'otp_expired' ||
        errorData.desc?.includes('expired') ||
        errorData.error === 'no_code_received';

      if (isExpiredError) {
        try {
          // Остання спроба перевірити сесію
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            toast.success(t('successVerified') || 'Successfully verified!');
            router.replace('/profile'); // Або /auth/update-password
            return;
          }
        } catch (e) {
          console.error('Session check failed', e);
        }
      }

      // Якщо сесії немає або помилка інша — показуємо екран помилки
      setCheckingSession(false);
      setIsClient(true);
    };

    handleCheck();
  }, [searchParams, router, t]);

  // === ОБРОБНИК ПОВТОРНОЇ ВІДПРАВКИ ===
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsResending(true);
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t('resendFailed') || 'Error sending email');
      } else {
        toast.success(t('resendSuccess') || 'Email sent successfully!');
        setEmail('');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsResending(false);
    }
  };

  // Визначаємо тип помилки для UI
  const errorCode = hashParams.error_code || searchParams.get('error_code');
  const errorParam = hashParams.error || searchParams.get('error');
  const errorDescription =
    hashParams.error_description || searchParams.get('error_description') || '';

  // Вважаємо посилання "простроченим", якщо код згорів АБО ми не отримали код взагалі
  const isExpired =
    errorCode === 'otp_expired' ||
    errorDescription.includes('expired') ||
    errorParam === 'no_code_received';

  const errorTypeKey = isExpired ? 'expired' : 'default';

  // Поки йде перевірка — показуємо лоадер
  if (!isClient || checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // === ВАРІАНТ 1: ПОСИЛАННЯ ЗАСТАРІЛО (Або Access Token в хеші) ===
  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2rem] shadow-xl p-8 text-center border border-gray-100 dark:border-neutral-800">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t('title.expired') || 'Посилання недійсне'}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm">
            {t('message.expired_suggestion') ||
              'Це посилання вже було використано. Спробуйте увійти або надішліть запит знову.'}
          </p>

          <div className="space-y-3">
            {/* Головна дія - Спробувати увійти */}
            <Link
              href="/auth?view=signin"
              className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {t('actions.tryLogin') || 'Спробувати увійти'}
            </Link>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-neutral-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-900 px-2 text-gray-500">
                  Або
                </span>
              </div>
            </div>

            {/* Додаткова дія - Відправити знову */}
            <form onSubmit={handleResend} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  t('enterEmailToResend') || 'Введіть email для повтору'
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-sm transition-all"
              />
              <button
                type="submit"
                disabled={isResending || !email}
                className="w-full bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {t('resendButton') || 'Надіслати посилання знову'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // === ВАРІАНТ 2: ІНШІ ПОМИЛКИ (Generic Error) ===
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-8 text-center border border-gray-100 dark:border-neutral-800">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t(`title.${errorTypeKey}`) || 'Помилка автентифікації'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {errorDescription || t(`message.${errorTypeKey}`)}
          </p>
        </div>

        {/* Блок повторної відправки для інших помилок */}
        <div className="mb-8 bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border border-gray-100 dark:border-neutral-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
            {t('enterEmailToResend') || 'Введіть email, щоб спробувати знову:'}
          </p>
          <form onSubmit={handleResend} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
            <button
              type="submit"
              disabled={isResending || !email}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {t('resendButton') || 'Надіслати повторно'}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signup"
            className="block w-full border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
          >
            {t('actions.requestNewLink')}
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-500 hover:text-black dark:hover:text-white text-sm py-2 transition"
          >
            {t('actions.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Огортаємо в Suspense, щоб useSearchParams не ламав білд
export default function AuthCodeError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <AuthCodeErrorContent />
    </Suspense>
  );
}
