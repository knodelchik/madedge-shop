/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { useCartStore } from '../../[locale]/store/cartStore';
import { useWishlistStore } from '../../[locale]/store/wishlistStore';
import { authService } from '../../[locale]/services/authService';
import { User } from '../../types/users';
import HeaderSkeleton from './HeaderSkeleton';
import SettingsDropdown from './SettingsDropdown';
import UserDropdown from './UserDropdown';
import WishlistDropdown from './WishlistDropdown';
import CartSheet from '../CartSheet';
import BurgerMenu from './BurgerMenu';
import MobileCartSheet from '../MobileCartSeet';
import MobileWishlistSheet from '../MobileWishlistSheet';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isMobileWishlistOpen, setIsMobileWishlistOpen] = useState(false);
  const t = useTranslations('Footer');

  const { loadWishlist, clearWishlist } = useWishlistStore();
  const router = useRouter();
  const controls = useAnimation();

  const handleAuthChange = useCallback(
    async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at,
        };
        setUser(userData);
        await useCartStore.getState().loadCartFromDatabase(session.user.id);
        await loadWishlist(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        useCartStore.getState().clearCart();
        clearWishlist();
      }
      setLoading(false);
    },
    [loadWishlist, clearWishlist]
  );

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      useCartStore.getState().clearCart();
      clearWishlist();
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearWishlist, router]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { user } = await authService.getCurrentUser();
        if (mounted && user) {
          setUser(user);
          await useCartStore.getState().loadCartFromDatabase(user.id);
          await loadWishlist(user.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: listener } =
      authService.supabase.auth.onAuthStateChange(handleAuthChange);

    initAuth();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [handleAuthChange, loadWishlist, clearWishlist]);

  if (loading) {

    return <HeaderSkeleton />;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-black md:bg-white/85 md:dark:bg-black border-b border-gray-200 dark:border-neutral-500 px-6 py-4">
        <div className="relative flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* ===== ЛІВА ЧАСТИНА - Назва MadEdge ===== */}
          <div className="flex-shrink-0">
            <div
              className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer"
              onClick={() => router.push('/')}
            >
              MadEdge
            </div>
          </div>

          {/* ===== ЦЕНТР - Логотип (з анімацією обертання) ===== */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <motion.div
              className="w-16 h-16 flex items-center justify-center cursor-pointer"
              animate={controls}
              onClick={async () => {
                await controls.start({
                  rotate: 360,
                  transition: { duration: 0.8, ease: 'easeInOut' },
                });
                controls.set({ rotate: 0 });
              }}
            >
              <Image
                src="/logo.jpeg"
                alt="Логотип"
                width={58}
                height={58}
                className="object-contain rounded-full"
              />
            </motion.div>
          </div>

          {/* ===== Навігація зліва ===== */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 -ml-[140px]">
            <Link
              href="/"
              className="text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
            >
              {t('footerHome')}
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
            >
              {t('footerShop')}
            </Link>
          </div>

          {/* ===== Навігація справа ===== */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 ml-[148px]">
            <Link
              href="/about"
              className="text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
            >
              {t('footerAboutUs')}
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
            >
              {t('footerContacts')}
            </Link>
          </div>

          {/* ===== ПРАВА ЧАСТИНА - Іконки ===== */}
          <div className="hidden md:flex items-center gap-4 text-gray-700 dark:text-neutral-300">
            <SettingsDropdown />
            <UserDropdown user={user} onSignOut={handleSignOut} />
            <WishlistDropdown user={user} />
            <CartSheet />
          </div>

          {/* ===== МОБІЛЬНЕ МЕНЮ ===== */}
          <div className="md:hidden">
            <BurgerMenu
              user={user}
              onSignOut={handleSignOut}
              onOpen={() => {
                setIsMobileCartOpen(false);
                setIsMobileWishlistOpen(false);
              }}
              onCartOpen={() => {
                setIsMobileWishlistOpen(false);
                setIsMobileCartOpen(true);
              }}
              onWishlistOpen={() => {
                setIsMobileCartOpen(false);
                setIsMobileWishlistOpen(true);
              }}
            />
          </div>
        </div>
      </header>

      {/* ===== MOBILE CART SHEET ===== */}
      <MobileCartSheet
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
      />

      {/* ===== MOBILE WISHLIST SHEET ===== */}
      <MobileWishlistSheet
        isOpen={isMobileWishlistOpen}
        onClose={() => setIsMobileWishlistOpen(false)}
      />
    </>
  );
}
