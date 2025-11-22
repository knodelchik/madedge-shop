'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, Link } from '@/navigation';
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
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// === ІМПОРТИ СТОРІВ ТА СЕРВІСІВ ===
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

// === ВАЖЛИВО: ІМПОРТУЄМО ВАШІ НОВІ КОМПОНЕНТИ ===
import EditProfileForm from '../../Components/Profile/EditProfileForm';
import AddressManager from '../../Components/Profile/AddressManager';

// Тип для вкладок
type ProfileTab =
  | 'profile'
  | 'orders'
  | 'addresses'
  | 'wishlist'
  | 'security';

function ProfilePageContent() {
  const t = useTranslations('Profile');
  const t_wishlist = useTranslations('Wishlist');
  const t_user_dropdown = useTranslations('UserDropdown');

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get('tab') as ProfileTab) || 'profile';

  // Логіка автентифікації та завантаження даних
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      // Отримуємо свіжі дані з профілю (таблиця users)
      const { profile } = await authService.getUserProfile(user.id);
      setUser({ ...user, ...profile } as User);
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

  // Обробник виходу
  const handleSignOut = async () => {
    setLoading(true);
    await authService.signOut();
  };

  // Навігація по вкладках
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
      label: 'Історія замовлень', // TODO: Додати переклад 'tabOrders'
      icon: <History size={18} />,
    },
    {
      id: 'addresses',
      label: 'Адреси доставки', // TODO: Додати переклад 'tabAddresses'
      icon: <MapPin size={18} />,
    },
    {
      id: 'wishlist',
      label: t_wishlist('title'),
      icon: <Heart size={18} />,
    },
    {
      id: 'security',
      label: 'Безпека', // TODO: Додати переклад 'tabSecurity'
      icon: <Lock size={18} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 dark:bg-neutral-800 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-neutral-800 rounded"></div>
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
          {/* ========================== */}
          {/* Бічна Навігація          */}
          {/* ========================== */}
          <aside className="md:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-4 sticky top-28">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as ProfileTab)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id
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
                    className="flex items-center space-x-3 w-full p-3 rounded-lg font-medium text-sm transition-colors text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={18} />
                    <span>{t_user_dropdown('signOut')}</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* ========================== */}
          {/* Контент Вкладок          */}
          {/* ========================== */}
          <main className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* ТУТ МИ ВИКОРИСТОВУЄМО ВАШІ НОВІ КОМПОНЕНТИ */}
                {activeTab === 'profile' && <EditProfileForm user={user} />}
                {activeTab === 'addresses' && <AddressManager userId={user.id} />}

                {/* Інші компоненти залишаються (поки що) вбудованими нижче */}
                {activeTab === 'orders' && <OrderHistory userId={user.id} />}
                {activeTab === 'wishlist' && <WishlistPage userId={user.id} />}
                {activeTab === 'security' && <ChangePasswordForm />}
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

// ====================================================================
// ВБУДОВАНІ КОМПОНЕНТИ (Ті, що ми ще не винесли в окремі файли)
// ====================================================================

function ChangePasswordForm() {
  const t = useTranslations('Profile');
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Пароль має бути не менше 6 символів'); // TODO: переклад
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Паролі не співпадають'); // TODO: переклад
      return;
    }

    setLoading(true);

    const { error } = await authService.supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Пароль успішно оновлено'); // TODO: переклад
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">
        Безпека {/* TODO: переклад */}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Новий пароль {/* TODO: переклад */}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-neutral-300 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Підтвердіть пароль {/* TODO: переклад */}
          </label>
          <input
            type="password"
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
            {loading ? 'Оновлення...' : 'Змінити пароль'} {/* TODO: переклад */}
          </button>
        </div>
      </form>
    </div>
  );
}

function WishlistPage({ userId }: { userId: string }) {
  const t = useTranslations('Wishlist');
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleMoveToCart = async (item: any) => {
    toast.promise(moveToCart(userId, item.product_id), {
      loading: t('addingToCart'),
      success: 'Товар додано до кошика!',
      error: 'Помилка',
    });
  };

  const handleRemove = (productId: number) => {
    removeFromWishlist(userId, productId);
    toast.success(t('remove'));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">
        {t('title')} ({wishlistItems.length})
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-30 text-gray-500" />
          <p className="text-gray-500 dark:text-neutral-400">{t('empty')}</p>
          <Link href="/shop" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
            {t('continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
              <Image
                src={item.products.images?.[0] || '/images/placeholder.jpg'}
                alt={item.products.title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${item.products.title.replace(/\s+/g, '-').toLowerCase()}`} className="font-medium text-sm truncate hover:underline text-gray-800 dark:text-neutral-100">
                  {item.products.title}
                </Link>
                <p className="text-green-600 font-semibold text-sm">${item.products.price}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => handleMoveToCart(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-neutral-700 rounded-md transition">
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button onClick={() => handleRemove(item.product_id)} className="p-2 text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-neutral-700 rounded-md transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderHistory({ userId }: { userId: string }) {
  const t = useTranslations('Profile');
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">
        Історія замовлень {/* TODO: переклад */}
      </h2>
      <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700">
        <History className="w-12 h-12 mx-auto mb-4 opacity-30 text-gray-500" />
        <p className="text-gray-500 dark:text-neutral-400">
          {t('noOrders') || 'У вас ще немає замовлень'}
        </p>
      </div>
    </div>
  );
}