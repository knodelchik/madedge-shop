'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { User } from '../../types/users';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { profile } = await authService.getUserProfile(user.id);
      setUser(profile);
      setLoading(false);
    };

    checkAuth();

    // Слухач змін автентифікації
    const {
      data: { subscription },
    } = authService.supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
        <div className="text-xl text-gray-800 dark:text-neutral-200">
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-neutral-800 p-6 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">
            {t('title')}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                {t('emailLabel')}
              </label>
              <p className="text-gray-800 dark:text-neutral-200">
                {user?.email}
              </p>
            </div>

            {user?.full_name && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  {t('fullNameLabel')}
                </label>
                <p className="text-gray-800 dark:text-neutral-200">
                  {user.full_name}
                </p>
              </div>
            )}

            {user?.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  {t('phoneLabel')}
                </label>
                <p className="text-gray-800 dark:text-neutral-200">
                  {user.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
