'use client';

import { useState } from 'react';
import { authService } from '../[locale]/services/authService';
import { AuthFormData } from '../types/users';
import { useCartStore } from '../[locale]/store/cartStore';
import { useTranslations } from 'next-intl';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSuccess?: () => void;
  onToggleType?: () => void;
}

export default function AuthForm({
  type,
  onSuccess,
  onToggleType,
}: AuthFormProps) {
  const t = useTranslations('AuthForm');

  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;

      if (type === 'signup') {
        result = await authService.signUp(formData);
      } else {
        result = await authService.signIn(formData);
      }
      if (result?.user) {
        // Синхронізуємо корзину після входу
        await useCartStore.getState().syncCartWithDatabase(result.user.id);
        onSuccess?.();
      }

      if (result?.error) {
        setError(result.error);
      } else {
        onSuccess?.();
      }
    } catch {
      setError(t('errors.unexpected'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-neutral-800 transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center">
        {type === 'signup' ? t('title.signup') : t('title.signin')}
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
            >
              {t('labels.fullName')}
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required={type === 'signup'}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
              placeholder={t('placeholders.fullName')}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
          >
            {t('labels.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            placeholder={t('placeholders.email')}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
          >
            {t('labels.password')}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            placeholder={t('placeholders.password')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading
            ? t('buttons.loading')
            : type === 'signup'
            ? t('buttons.create')
            : t('buttons.signin')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onToggleType}
          className="text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          {type === 'signup' ? t('toggle.haveAccount') : t('toggle.noAccount')}
        </button>
      </div>
    </div>
  );
}
