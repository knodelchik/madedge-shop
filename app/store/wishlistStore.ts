// store/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItemWithProduct } from '../types/wishlist';
import { wishlistService } from '../services/wishlistService';
import { useCartStore } from './cartStore'; // Додаємо імпорт cartStore

interface WishlistState {
  wishlistItems: WishlistItemWithProduct[];
  loading: boolean;
  
  loadWishlist: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, productId: number) => Promise<void>;
  removeFromWishlist: (userId: string, productId: number) => Promise<void>;
  isInWishlist: (userId: string, productId: number) => Promise<boolean>;
  moveToCart: (userId: string, productId: number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      loading: false,

      loadWishlist: async (userId: string) => {
        set({ loading: true });
        try {
          const items = await wishlistService.getWishlist(userId);
          set({ wishlistItems: items });
        } catch (error) {
          console.error('Failed to load wishlist:', error);
        } finally {
          set({ loading: false });
        }
      },

      addToWishlist: async (userId: string, productId: number) => {
        try {
          const success = await wishlistService.addToWishlist(userId, productId);
          if (success) {
            await get().loadWishlist(userId);
          }
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
        }
      },

      removeFromWishlist: async (userId: string, productId: number) => {
        try {
          const success = await wishlistService.removeFromWishlist(userId, productId);
          if (success) {
            set(state => ({
              wishlistItems: state.wishlistItems.filter(item => item.product_id !== productId)
            }));
          }
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
        }
      },

      isInWishlist: async (userId: string, productId: number): Promise<boolean> => {
        return await wishlistService.isInWishlist(userId, productId);
      },

      moveToCart: async (userId: string, productId: number) => {
        try {
          // Використовуємо сервіс для переміщення
          const success = await wishlistService.moveToCart(userId, productId);
          
          if (success) {
            // Оновлюємо wishlist
            set(state => ({
              wishlistItems: state.wishlistItems.filter(item => item.product_id !== productId)
            }));
            
            // Оновлюємо корзину - завантажуємо актуальні дані
            await useCartStore.getState().loadCartFromDatabase(userId);
            
            console.log('✅ Item moved from wishlist to cart');
          }
        } catch (error) {
          console.error('❌ Failed to move to cart:', error);
        }
      },

      clearWishlist: () => {
        set({ wishlistItems: [] });
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ 
        wishlistItems: state.wishlistItems 
      })
    }
  )
);