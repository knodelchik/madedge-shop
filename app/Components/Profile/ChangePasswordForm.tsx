'use client';

import { useState } from 'react';
import { authService } from '@/app/[locale]/services/authService';
import { toast } from 'sonner';
import { User } from '@/app/types/users';
import { Lock, KeyRound, ShieldAlert, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChangePasswordFormProps {
  user: User;
}

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  // Використовуємо namespace 'Profile.Security'
  const t = useTranslations('Profile.Security');
  const [loading, setLoading] = useState(false);

  // Стани для форми зміни пароля
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Логіка зміни пароля (з перевіркою старого)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(t('errors.passwordLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('errors.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      // 1. ПЕРЕВІРКА СТАРОГО ПАРОЛЯ
      const { error: verifyError } = await authService.signIn({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        toast.error(t('errors.wrongCurrentPassword'));
        setLoading(false);
        return;
      }

      // 2. ЯКЩО ПЕРЕВІРКА ПРОЙШЛА - ОНОВЛЮЄМО ПАРОЛЬ
      const { error: updateError } = await authService.supabase.auth.updateUser(
        {
          password: newPassword,
        }
      );

      if (updateError) {
        toast.error(updateError.message); // Повідомлення від Supabase зазвичай технічне, можна залишити як є або мапити
      } else {
        toast.success(t('success.passwordChanged'));
        // Очищаємо поля
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(t('errors.updateError'));
    } finally {
      setLoading(false);
    }
  };

  // Логіка "Забув пароль"
  const handleForgotPassword = async () => {
    const { error } = await authService.resetPasswordForEmail(user.email);
    if (error) {
      toast.error(error);
    } else {
      // Передаємо параметр email у переклад
      toast.success(t('success.resetEmailSent', { email: user.email }));
    }
  };

  // Логіка "Вийти з усіх пристроїв"
  const handleGlobalSignOut = async () => {
    if (confirm(t('confirmGlobalSignOut'))) {
      const { error } = await authService.supabase.auth.signOut({
        scope: 'global',
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('success.globalSignOut'));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Секція 1: Зміна пароля */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <Lock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">
            {t('title')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
            >
              {t('labels.currentPassword')}
            </label>
            <input
              type="password"
              id="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('placeholders.currentPassword')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            />
            {/* Кнопка "Забули пароль?" */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <KeyRound size={12} />
                {t('forgotPassword')}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-neutral-800 my-4"></div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
            >
              {t('labels.newPassword')}
            </label>
            <input
              type="password"
              id="newPassword"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('placeholders.newPassword')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
            >
              {t('labels.confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('placeholders.confirmPassword')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !currentPassword}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? t('buttons.updating') : t('buttons.update')}
            </button>
          </div>
        </form>
      </div>

      {/* Секція 2: Додаткова безпека (Вихід з усіх пристроїв) */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-red-100 dark:border-red-900/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">
            {t('dangerZone.title')}
          </h2>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {t('dangerZone.signOutTitle')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dangerZone.signOutDesc')}
            </p>
          </div>
          <button
            onClick={handleGlobalSignOut}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut size={16} />
            {t('dangerZone.signOutButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
