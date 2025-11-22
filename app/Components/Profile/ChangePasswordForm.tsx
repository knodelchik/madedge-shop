// app/Components/Profile/ChangePasswordForm.tsx

'use client';

import { useState } from 'react';
import { authService } from '@/app/[locale]/services/authService';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error('Пароль має бути не менше 6 символів.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Паролі не збігаються.');
      return;
    }

    setLoading(true);
    
    const { error } = await authService.supabase.auth.updateUser({ 
      password: newPassword 
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Пароль успішно змінено!');
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">
        Зміна паролю
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Новий пароль
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Оновлення...' : 'Оновити пароль'}
          </button>
        </div>
      </form>
    </div>
  );
}