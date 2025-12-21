// app/[locale]/auth/auth-code-error/page.tsx
import Link from 'next/link';

export default function AuthCodeError({
  searchParams,
  params,
}: {
  searchParams: { error?: string; error_description?: string };
  params: { locale: string };
}) {
  const locale = params.locale || 'uk';
  const errorCode = searchParams.error || 'unknown_error';
  const errorDescription =
    searchParams.error_description || 'An unknown error occurred';

  // Перекладаємо помилки
  const getErrorMessage = (code: string, description: string) => {
    if (code === 'otp_expired' || description.includes('expired')) {
      return {
        title: 'Посилання прострочене',
        message:
          'Посилання для підтвердження електронної пошти прострочене. Будь ласка, запросіть нове посилання.',
        titleEn: 'Link Expired',
        messageEn:
          'The email confirmation link has expired. Please request a new link.',
      };
    }
    if (code === 'access_denied') {
      return {
        title: 'Доступ заборонено',
        message: 'Не вдалося підтвердити вашу електронну пошту.',
        titleEn: 'Access Denied',
        messageEn: 'Unable to verify your email address.',
      };
    }
    return {
      title: 'Помилка автентифікації',
      message: 'Сталася помилка під час підтвердження вашої електронної пошти.',
      titleEn: 'Authentication Error',
      messageEn: 'An error occurred while confirming your email.',
    };
  };

  const error = getErrorMessage(errorCode, errorDescription);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Іконка помилки */}
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

        {/* Українська версія */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error.title}
          </h1>
          <p className="text-gray-600">{error.message}</p>
        </div>

        {/* Англійська версія */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error.titleEn}
          </h2>
          <p className="text-gray-600">{error.messageEn}</p>
        </div>

        {/* Детальна інформація про помилку (для розробки) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Technical details
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

        {/* Кнопки дій */}
        <div className="space-y-3">
          <Link
            href="/auth/signup"
            className="block w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Запросити нове посилання / Request New Link
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            На головну / Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
