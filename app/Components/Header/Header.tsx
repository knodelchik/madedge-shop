'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/authService';
import { User as UserType } from '../../types/users';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

// Імпорт розділених компонентів
import HeaderSkeleton from './HeaderSkeleton';
import Navigation from './Navigation';
import WishlistDropdown from './WishlistDropdown';
import SettingsDropdown from './SettingsDropdown';
import UserDropdown from './UserDropdown';
import CartSheet from '../CartSheet';

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { loadWishlist } = useWishlistStore();

  // Обробник змін авторизації
  const handleAuthChange = useCallback(async (event: string, session: any) => {
    console.log('🔐 Auth state changed:', event);

    try {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Завантажуємо корзину та wishlist
        await useCartStore.getState().loadCartFromDatabase(session.user.id);
        await loadWishlist(session.user.id);
        
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
      }
    } catch (error) {
      console.error('❌ Error during auth change:', error);
    } finally {
      setLoading(false);
    }
  }, [loadWishlist]);

  // Ініціалізація авторизації
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        
        if (mounted) {
          if (user) {
            setUser(user);
            await useCartStore.getState().loadCartFromDatabase(user.id);
            await loadWishlist(user.id);
          }
          setLoading(false);
        }

        if (error) {
          console.error('❌ Auth initialization error:', error);
        }
      } catch (error) {
        console.error('❌ Unexpected auth error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(handleAuthChange);
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange, loadWishlist]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();
      router.push('/');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between">
      {/* Лого */}
      <div className="text-2xl font-bold text-gray-800">MadEdge</div>

      {/* Навігація */}
      <Navigation />

      {/* Елементи управління */}
      <div className="flex items-center gap-4 text-gray-700">
        <WishlistDropdown user={user} />
        <SettingsDropdown />
        <UserDropdown user={user} onSignOut={handleSignOut} />
        <CartSheet />
      </div>
    </header>
  );
}