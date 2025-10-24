'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../[locale]/store/wishlistStore';
import { authService } from '../[locale]/services/authService';

interface WishlistButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function WishlistButton({
  productId,
  size = 'md',
  className = '',
  onClick,
}: WishlistButtonProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  const {
    addToWishlist,
    removeFromWishlist,
    wishlistItems,
    isInLocalWishlist,
  } = useWishlistStore();

  // Перевіряємо поточного користувача
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await authService.getCurrentUser();
      if (user) {
        setUser({ id: user.id });
      } else {
        setUser(null);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = authService.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Визначаємо чи товар в wishlist
  const isInWishlist = user
    ? wishlistItems.some(
        (item) => item.product_id === productId && item.user_id === user.id
      )
    : isInLocalWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(user?.id || null, productId);
      } else {
        await addToWishlist(user?.id || null, productId);
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
    lg: 'w-12 h-12',
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${sizeClasses[size]} 
        flex items-center justify-center 
        rounded-full border transition-all
        ${
          isInWishlist
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
          transition-all duration-300
        `}
      />
    </button>
  );
}
