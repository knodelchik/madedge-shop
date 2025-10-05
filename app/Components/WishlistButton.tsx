'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WishlistButton({ productId, size = 'md', className = '' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  const { addToWishlist, removeFromWishlist, isInWishlist: checkInWishlist } = useWishlistStore();
  const router = useRouter();

  // Перевіряємо поточного користувача
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await authService.getCurrentUser();
      // Використовуємо тільки id, оскільки він нам потрібен
      if (user) {
        setUser({ id: user.id });
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Слухаємо зміни авторизації
    const { data: { subscription } } = authService.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Перевіряємо чи товар в wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user) {
        const inWishlist = await checkInWishlist(user.id, productId);
        setIsInWishlist(inWishlist);
      }
    };

    checkWishlistStatus();
  }, [user, productId, checkInWishlist]);

  const handleClick = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(user.id, productId);
        setIsInWishlist(false);
      } else {
        await addToWishlist(user.id, productId);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${sizeClasses[size]} 
        flex items-center justify-center 
        rounded-full border transition-all
        ${isInWishlist 
          ? 'bg-red-500 border-red-500 text-white' 
          : 'bg-white border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400'
        }
        ${className}
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`
          ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
          ${isInWishlist ? 'fill-current' : ''}
        `} 
      />
    </button>
  );
}