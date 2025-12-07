'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { authService } from '../services/authService';
import { User } from '../../types/users';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  MapPin,
  Heart,
  Lock,
  LogOut,
  History,
} from 'lucide-react';

// Імпорти сторів та сервісів
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

// ІМПОРТ АДРЕСНОГО МЕНЕДЖЕРА ТА ІНШИХ КОМПОНЕНТІВ
import AddressManager from '../../Components/Profile/AddressManager';
import EditProfileForm from '@/app/Components/Profile/EditProfileForm';
import WishlistPage from '@/app/Components/Profile/WishlistPage';
import ChangePasswordForm from '@/app/Components/Profile/ChangePasswordForm';
import OrderHistory from '@/app/Components/Profile/OrderHistory';

// Тип для вкладок
type ProfileTab = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'security';

function ProfilePageContent() {
  const t = useTranslations('Profile');
  const t_wishlist = useTranslations('Wishlist');
  const t_user_dropdown = useTranslations('UserDropdown');

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get('tab') as ProfileTab) || 'profile';

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      // 1. Отримуємо дані авторизації
      const { user: authUser } = await authService.getCurrentUser();

      if (!authUser) {
        router.push('/auth');
        return;
      }

      // 2. Отримуємо дані з бази
      const { profile } = await authService.getUserProfile(authUser.id);

      // 3. Об'єднуємо дані
      const mergedUser = {
        ...authUser,
        ...profile,
      };

      setUser(mergedUser as User);
      setLoading(false);
    };

    checkAuth();

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

  const handleSignOut = async () => {
    setLoading(true);
    await authService.signOut();
  };

  const handleTabChange = (tab: ProfileTab) => {
    router.push(`/profile?tab=${tab}`);
  };

  const tabs = [
    {
      id: 'profile',
      label: t('title'),
      icon: <UserIcon size={18} />,
    },
    {
      id: 'orders',
      label: t('tabOrders'), // Використовуємо переклад
      icon: <History size={18} />,
    },
    {
      id: 'addresses',
      label: t('tabAddresses'), // Використовуємо переклад
      icon: <MapPin size={18} />,
    },
    {
      id: 'wishlist',
      label: t_wishlist('title'),
      icon: <Heart size={18} />,
    },
    {
      id: 'security',
      label: t('tabSecurity'), // Використовуємо переклад
      icon: <Lock size={18} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Скелетон бічної панелі */}
            <aside className="md:col-span-1">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-4">
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full animate-pulse"
                    />
                  ))}
                  <div className="h-10 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full animate-pulse mt-4" />
                </div>
              </div>
            </aside>
            {/* Скелетон контенту */}
            <main className="md:col-span-3">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
                <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded-lg w-48 mb-6 animate-pulse" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-24 mb-2 animate-pulse" />
                      <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-black py-12 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Бічна Навігація */}
          <aside className="md:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-4 sticky top-28">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as ProfileTab)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium text-sm transition-colors  cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
                <div className="pt-2 border-t border-gray-100 dark:border-neutral-800">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg font-medium text-sm transition-colors text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20  cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span>{t_user_dropdown('signOut')}</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Контент Вкладок */}
          <main className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && <EditProfileForm user={user} />}
                {activeTab === 'orders' && <OrderHistory userId={user.id} />}
                {activeTab === 'addresses' && (
                  <AddressManager userId={user.id} userPhone={user.phone} />
                )}
                {activeTab === 'wishlist' && <WishlistPage userId={user.id} />}
                {activeTab === 'security' && <ChangePasswordForm user={user} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  );
}
