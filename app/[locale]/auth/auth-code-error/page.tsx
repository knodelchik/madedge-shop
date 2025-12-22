'use client';

import { Link } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Додаємо useLocale
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner'; // Додаємо тости для сповіщень
import { Loader2, RefreshCw, Mail } from 'lucide-react'; // Іконки

export default function AuthCodeError() {
  const t = useTranslations('AuthError');
  // Можливо, доведеться додати нові ключі в AuthError або використати існуючі
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale(); // Отримуємо поточну мову

  const [hashParams, setHashParams] = useState<{
    error?: string;
    error_description?: string;
  }>({});

  const [isClient, setIsClient] = useState(false);

  // === СТАНИ ДЛЯ ПОВТОРНОЇ ВІДПРАВКИ ===
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const queryError = searchParams.get('error');
    const queryDesc = searchParams.get('error_description');
    const hasSearchError = !!queryError || !!queryDesc;

    let hasHashError = false;

    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hashError = params.get('error');
      const hashDesc = params.get('error_description');

      if (hashError || hashDesc) {
        hasHashError = true;
        setHashParams({
          error: hashError || undefined,
          error_description: hashDesc || undefined,
        });
      }
    }

    if (!hasSearchError && !hasHashError) {
      router.replace('/');
    } else {
      setIsClient(true);
    }
  }, [searchParams, router]);

  // === ЛОГІКА ПОВТОРНОЇ ВІДПРАВКИ ===
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
        // Можна очистити поле або перекинути на сторінку входу
        setEmail('');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsResending(false);
    }
  };

  const errorCode =
    searchParams.get('error') || hashParams.error || 'unknown_error';
  const errorDescription =
    searchParams.get('error_description') ||
    hashParams.error_description ||
    'An unknown error occurred';

  const getErrorType = (code: string, description: string) => {
    if (code === 'otp_expired' || description.includes('expired')) {
      return 'expired';
    }
    if (code === 'access_denied') {
      return 'accessDenied';
    }
    return 'default';
  };

  const errorType = getErrorType(errorCode, errorDescription);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t(`title.${errorType}`)}
          </h1>
          <p className="text-gray-600">{t(`message.${errorType}`)}</p>
        </div>

        {/* === БЛОК ПОВТОРНОЇ ВІДПРАВКИ === */}
        <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3 font-medium">
            {t('enterEmailToResend') ||
              'Введіть email, щоб отримати посилання знову:'}
          </p>
          <form onSubmit={handleResend} className="flex flex-col gap-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              disabled={isResending || !email}
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
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

        {/* ТЕХНІЧНІ ДЕТАЛІ (тільки для dev) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              {t('technicalDetails')}
            </summary>
            <div className="bg-gray-100 rounded p-3 text-xs font-mono break-all">
              <p>
                <strong>Error:</strong> {errorCode}
              </p>
              <p>
                <strong>Description:</strong> {errorDescription}
              </p>
            </div>
          </details>
        )}

        <div className="space-y-3">
          <Link
            href="/auth/signup"
            className="block w-full border border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            {t('actions.requestNewLink')} {/* Або "Створити новий акаунт" */}
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-500 hover:text-black text-sm py-2 transition"
          >
            {t('actions.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
