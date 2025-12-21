// app/[locale]/auth/auth-code-error/page.tsx
'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface PageProps {
  searchParams: { error?: string; error_description?: string };
  params: { locale: string };
}

export default function AuthCodeError({ searchParams }: PageProps) {
  const t = useTranslations('AuthError');
  const [hashParams, setHashParams] = useState<{
    error?: string;
    error_description?: string;
  }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      setHashParams({
        error: params.get('error') || undefined,
        error_description: params.get('error_description') || undefined,
      });
    }
  }, []);

  const errorCode = searchParams.error || hashParams.error || 'unknown_error';
  const errorDescription =
    searchParams.error_description ||
    hashParams.error_description ||
    'An unknown error occurred';

  // Визначаємо тип помилки для правильного перекладу
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
              <p>
                <strong>Source:</strong>{' '}
                {searchParams.error
                  ? 'query string'
                  : hashParams.error
                  ? 'hash'
                  : 'default'}
              </p>
            </div>
          </details>
        )}

        <div className="space-y-3">
          <Link
            href="/auth/signup"
            className="block w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            {t('actions.requestNewLink')}
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            {t('actions.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
