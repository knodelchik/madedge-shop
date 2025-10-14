'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/authService';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { User } from '../../types/users';

import { Heart, ShoppingCart } from 'lucide-react';
import BurgerMenu from './BurgerMenu'; 

import HeaderSkeleton from './HeaderSkeleton';
import Navigation from './Navigation';
import WishlistDropdown from './WishlistDropdown';
import SettingsDropdown from './SettingsDropdown';
import UserDropdown from './UserDropdown';
import CartSheet from '../CartSheet';


// Тип для Supabase Auth Session
interface SupabaseSession {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
    created_at?: string;
    updated_at?: string;
  };
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { loadWishlist, clearWishlist } = useWishlistStore();

  const handleAuthChange = useCallback(async (event: string, session: SupabaseSession | null) => {
    try {
      if (event === 'SIGNED_IN' && session?.user) {
        // Конвертуємо Supabase user в наш тип User
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at
        };
        
        setUser(userData);
        await useCartStore.getState().loadCartFromDatabase(session.user.id);
        await loadWishlist(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        useCartStore.getState().clearCart();
        clearWishlist();
      }
    } catch (error) {
      console.error('❌ Auth change error:', error);
    } finally {
      setLoading(false);
    }
  }, [loadWishlist, clearWishlist]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        if (mounted) {
          if (user) {
            setUser(user);
            await useCartStore.getState().loadCartFromDatabase(user.id);
            await loadWishlist(user.id);
          }
          if (error) console.error(error);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ initAuth error:', error);
        setLoading(false);
      }
    };

    const { data: listener } = authService.supabase.auth.onAuthStateChange(handleAuthChange);
    initAuth();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [handleAuthChange, loadWishlist]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      useCartStore.getState().clearCart();
      clearWishlist();
      router.push('/');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <HeaderSkeleton />;

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
  <div className="hidden md:flex  items-center gap-4 text-gray-700 dark:text-gray-200 justify-self-end">
    <SettingsDropdown />
    <UserDropdown user={user} onSignOut={handleSignOut} />
    <WishlistDropdown user={user} />
    <CartSheet />

    {/* Мобільне меню */}
      <div className="md:hidden">
        <BurgerMenu user={user} onSignOut={handleSignOut} />
      </div>
  </div>
</header>

  );
}