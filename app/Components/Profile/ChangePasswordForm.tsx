'use client';

import { useState } from 'react';
import { authService } from '@/app/[locale]/services/authService';
import { toast } from 'sonner';
import { User } from '@/app/types/users';
import { Lock, KeyRound, ShieldAlert, LogOut } from 'lucide-react';

interface ChangePasswordFormProps {
  user: User;
}

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Стани для форми зміни пароля
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Логіка зміни пароля (з перевіркою старого)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error('Новий пароль має бути не менше 6 символів.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Паролі не збігаються.');
      return;
    }

    setLoading(true);

    try {
      // 1. ПЕРЕВІРКА СТАРОГО ПАРОЛЯ
      // Ми намагаємось "увійти" з поточним емейлом і введеним старим паролем.
      // Якщо пароль невірний, Supabase поверне помилку.
      const { error: verifyError } = await authService.signIn({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        toast.error('Невірний поточний пароль');
        setLoading(false);
        return;
      }

      // 2. ЯКЩО ПЕРЕВІРКА ПРОЙШЛА - ОНОВЛЮЄМО ПАРОЛЬ
      const { error: updateError } = await authService.supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (updateError) {
        toast.error(updateError.message);
      } else {
        toast.success('Пароль успішно змінено!');
        // Очищаємо поля
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error('Сталася помилка при зміні паролю');
    } finally {
      setLoading(false);
    }
  };

  // Логіка "Забув пароль" (всередині профілю)
  const handleForgotPassword = async () => {
    const { error } = await authService.resetPasswordForEmail(user.email);
    if (error) {
      toast.error(error);
    } else {
      toast.success(`Лист для відновлення надіслано на ${user.email}`);
    }
  };

  // Логіка "Вийти з усіх пристроїв"
  const handleGlobalSignOut = async () => {
    if (confirm('Ви впевнені? Вам доведеться увійти знову на цьому пристрої.')) {
      const { error } = await authService.supabase.auth.signOut({ scope: 'global' });
      if (error) {
        toast.error(error.message);
      } else {
        // Перенаправлення на логін відбудеться автоматично через auth listener в page.tsx або middleware
        toast.success('Вихід виконано з усіх пристроїв');
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
            Зміна паролю
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Поточний пароль
            </label>
            <input
              type="password"
              id="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Введіть старий пароль"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            />
            {/* Кнопка "Забули пароль?" */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
              >
                <KeyRound size={12} />
                Я не пам'ятаю поточний пароль
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-neutral-800 my-4"></div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Новий пароль
            </label>
            <input
              type="password"
              id="newPassword"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введіть новий пароль"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Підтвердіть новий пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторіть новий пароль"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !currentPassword}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Перевірка та оновлення...' : 'Оновити пароль'}
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
            Зона небезпеки
          </h2>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Вийти з усіх пристроїв</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Це завершить вашу сесію на всіх комп'ютерах та телефонах, де ви увійшли.
            </p>
          </div>
          <button
            onClick={handleGlobalSignOut}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Вийти всюди
          </button>
        </div>
      </div>
    </div>
  );
}