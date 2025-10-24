import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItemWithProduct } from '../../types/wishlist';
import { wishlistService } from '../services/wishlistService';
import { useCartStore } from './cartStore';
import { Product } from '../../types/products';

interface WishlistState {
  wishlistItems: WishlistItemWithProduct[];
  localWishlist: number[]; // IDs продуктів для неавторизованих користувачів
  loading: boolean;

  // Для авторизованих користувачів
  loadWishlist: (userId: string) => Promise<void>;
  addToWishlist: (userId: string | null, productId: number) => Promise<void>;
  removeFromWishlist: (
    userId: string | null,
    productId: number
  ) => Promise<void>;
  isInWishlist: (userId: string | null, productId: number) => Promise<boolean>;
  moveToCart: (userId: string, productId: number) => Promise<void>;
  clearWishlist: () => void;

  // Для неавторизованих користувачів
  addToLocalWishlist: (productId: number) => void;
  removeFromLocalWishlist: (productId: number) => void;
  isInLocalWishlist: (productId: number) => boolean;

  // Синхронізація
  syncLocalWishlist: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      localWishlist: [],
      loading: false,

      // Для авторизованих користувачів
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

      addToWishlist: async (userId: string | null, productId: number) => {
        if (!userId) {
          // Для неавторизованих - зберігаємо локально
          get().addToLocalWishlist(productId);
          return;
        }

        try {
          const success = await wishlistService.addToWishlist(
            userId,
            productId
          );
          if (success) {
            await get().loadWishlist(userId);
          }
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
        }
      },

      removeFromWishlist: async (userId: string | null, productId: number) => {
        if (!userId) {
          // Для неавторизованих - видаляємо локально
          get().removeFromLocalWishlist(productId);
          return;
        }

        try {
          const success = await wishlistService.removeFromWishlist(
            userId,
            productId
          );
          if (success) {
            set((state) => ({
              wishlistItems: state.wishlistItems.filter(
                (item) => item.product_id !== productId
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
        }
      },

      isInWishlist: async (
        userId: string | null,
        productId: number
      ): Promise<boolean> => {
        if (!userId) {
          // Для неавторизованих - перевіряємо локальний список
          return get().isInLocalWishlist(productId);
        }
        return await wishlistService.isInWishlist(userId, productId);
      },

      moveToCart: async (userId: string, productId: number) => {
        try {
          const success = await wishlistService.moveToCart(userId, productId);

          if (success) {
            set((state) => ({
              wishlistItems: state.wishlistItems.filter(
                (item) => item.product_id !== productId
              ),
            }));

            await useCartStore.getState().loadCartFromDatabase(userId);
          }
        } catch (error) {
          console.error('❌ Failed to move to cart:', error);
        }
      },

      clearWishlist: () => {
        set({ wishlistItems: [], localWishlist: [] });
      },

      // Для неавторизованих користувачів
      addToLocalWishlist: (productId: number) => {
        set((state) => ({
          localWishlist: [...state.localWishlist, productId],
        }));
      },

      removeFromLocalWishlist: (productId: number) => {
        set((state) => ({
          localWishlist: state.localWishlist.filter((id) => id !== productId),
        }));
      },

      isInLocalWishlist: (productId: number) => {
        return get().localWishlist.includes(productId);
      },

      // Синхронізація локального wishlist з базою даних при авторизації
      syncLocalWishlist: async (userId: string) => {
        const { localWishlist } = get();

        if (localWishlist.length === 0) return;

        try {
          // Додаємо всі товари з локального wishlist в базу даних
          for (const productId of localWishlist) {
            await wishlistService.addToWishlist(userId, productId);
          }

          // Очищаємо локальний wishlist
          set({ localWishlist: [] });

          // Завантажуємо оновлений wishlist з бази даних
          await get().loadWishlist(userId);

          console.log('✅ Local wishlist synced with database');
        } catch (error) {
          console.error('❌ Failed to sync local wishlist:', error);
        }
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
        localWishlist: state.localWishlist, // Зберігаємо локальний wishlist
      }),
    }
  )
);
