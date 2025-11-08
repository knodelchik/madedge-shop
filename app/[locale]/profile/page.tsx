'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { User } from '../../types/users';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-neutral-800 p-6"
            >
              {/* Skeleton Header */}
              <div className="mb-6">
                <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded-lg w-32 animate-pulse" />
              </div>

              {/* Skeleton Fields */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-20 mb-2 animate-pulse" />
                    <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full animate-pulse" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-black py-12 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-neutral-800 p-6 transition-colors duration-300"
        >
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6"
          >
            {t('title')}
          </motion.h2>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                {t('emailLabel')}
              </label>
              <p className="text-gray-800 dark:text-neutral-200 mt-1">
                {user?.email}
              </p>
            </motion.div>

            {user?.full_name && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  {t('fullNameLabel')}
                </label>
                <p className="text-gray-800 dark:text-neutral-200 mt-1">
                  {user.full_name}
                </p>
              </motion.div>
            )}

            {user?.phone && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  {t('phoneLabel')}
                </label>
                <p className="text-gray-800 dark:text-neutral-200 mt-1">
                  {user.phone}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
