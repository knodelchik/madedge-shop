'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../[locale]/store/cartStore';
import { useWishlistStore } from '../../[locale]/store/wishlistStore';
import { authService } from '../../[locale]/services/authService';
import { User } from '../../types/users';
import HeaderSkeleton from './HeaderSkeleton';
import Navigation from './Navigation';
import SettingsDropdown from './SettingsDropdown';
import UserDropdown from './UserDropdown';
import WishlistDropdown from './WishlistDropdown';
import CartSheet from '../CartSheet';
import BurgerMenu from './BurgerMenu';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { loadWishlist, clearWishlist } = useWishlistStore();
  const router = useRouter();

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

  // ✅ Завжди рендеримо однаковий контент (скелетон або header)
  // Це гарантує однаковий HTML на сервері та клієнті
  if (loading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-md px-6 py-4 grid grid-cols-3 items-center">
      {/* Ліва частина */}
      <div
        className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer justify-self-start"
        onClick={() => router.push('/')}
      >
        MadEdge
      </div>

      {/* Центр */}
      <div className="justify-self-center hidden md:block">
        <Navigation />
      </div>

      {/* Права частина */}
      <div className="hidden md:flex items-center gap-4 text-gray-700 dark:text-gray-200 justify-self-end">
        <SettingsDropdown />
        <UserDropdown user={user} onSignOut={handleSignOut} />
        <WishlistDropdown user={user} />
        <CartSheet />
      </div>

      {/* Мобільне меню */}
      <div className="md:hidden">
        <BurgerMenu user={user} onSignOut={handleSignOut} />
      </div>
    </header>
  );
}
