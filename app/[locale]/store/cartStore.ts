import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { Product } from '../../types/products';
import { toast } from 'sonner';

type CartItem = {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity: number;
  stock: number;
};

interface CartStore {
  cartItems: CartItem[];
  isSyncing: boolean;
  lastUser: string | null;

  // ОНОВЛЕНО: додано аргумент t?: any
  addToCart: (product: Product & { quantity: number }, t?: any) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number, t?: any) => void;
  increaseQuantity: (productId: number, t?: any) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;

  syncCartWithDatabase: (userId: string) => Promise<void>;
  loadCartFromDatabase: (userId: string) => Promise<void>;
  handleAuthChange: (user: { id: string } | null) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isSyncing: false,
      lastUser: null,

      // ОНОВЛЕНО: приймаємо t
      addToCart: (product, t) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((item) => item.id === product.id);

        const currentQty = existingItem ? existingItem.quantity : 0;
        const requestedTotal = currentQty + product.quantity;
        const limit = product.stock ?? 999;

        if (requestedTotal > limit) {
          // ВИКОРИСТОВУЄМО t ДЛЯ ПЕРЕКЛАДУ
          const message = t
            ? t('addToCartLimit', { limit, current: currentQty })
            : `Limit reached: ${limit}`;

          toast.error(message);
          return;
        }

        let newCartItems: CartItem[];

        if (existingItem) {
          newCartItems = cartItems.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + product.quantity,
                  stock: limit,
                }
              : item
          );
        } else {
          newCartItems = [
            ...cartItems,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              images: product.images,
              quantity: product.quantity,
              stock: limit,
            },
          ];
        }

        set({ cartItems: newCartItems });

        const syncWithDB = async () => {
          const { user } = await authService.getCurrentUser();
          if (user) {
            console.log('🔄 Syncing add to cart for user:', user.id);
            await cartService.addToCart(
              user.id,
              product.id,
              existingItem
                ? existingItem.quantity + product.quantity
                : product.quantity
            );
          }
        };

        syncWithDB();
      },

      removeFromCart: (productId) => {
        const { cartItems } = get();
        const newCartItems = cartItems.filter((item) => item.id !== productId);
        set({ cartItems: newCartItems });

        const syncWithDB = async () => {
          const { user } = await authService.getCurrentUser();
          if (user) {
            await cartService.removeFromCart(user.id, productId);
          }
        };

        syncWithDB();
      },

      // ОНОВЛЕНО: приймаємо t
      updateQuantity: (productId, quantity, t) => {
        const { cartItems } = get();

        const item = cartItems.find((i) => i.id === productId);

        // Перевірка ліміту при ручному введенні
        if (item && quantity > item.stock) {
          const message = t
            ? t('updateLimit', { max: item.stock })
            : `Max available: ${item.stock}`;

          toast.error(message);
          quantity = item.stock;
        }

        const newCartItems = cartItems
          .map((item) => (item.id === productId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0);

        set({ cartItems: newCartItems });

        const syncWithDB = async () => {
          const { user } = await authService.getCurrentUser();
          if (user) {
            if (quantity <= 0) {
              await cartService.removeFromCart(user.id, productId);
            } else {
              await cartService.updateQuantity(user.id, productId, quantity);
            }
          }
        };

        syncWithDB();
      },

      // ОНОВЛЕНО: приймаємо t
      increaseQuantity: (productId, t) => {
        const { cartItems } = get();
        const item = cartItems.find((item) => item.id === productId);

        if (item) {
          if (item.quantity >= item.stock) {
            const message = t ? t('maxStockReached') : 'Max stock reached';

            toast.error(message);
            return;
          }
          // Передаємо t далі в updateQuantity
          get().updateQuantity(productId, item.quantity + 1, t);
        }
      },

      decreaseQuantity: (productId) => {
        const { cartItems } = get();
        const item = cartItems.find((item) => item.id === productId);

        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1);
        } else if (item && item.quantity === 1) {
          get().removeFromCart(productId);
        }
      },

      clearCart: () => {
        set({ cartItems: [] });
        const syncWithDB = async () => {
          const { user } = await authService.getCurrentUser();
          if (user) {
            await cartService.clearCart(user.id);
          }
        };
        syncWithDB();
      },

      syncCartWithDatabase: async (userId: string) => {
        set({ isSyncing: true });
        try {
          const { cartItems } = get();
          const cartForSync = cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          }));

          console.log('🔄 Syncing cart to database:', cartForSync);
          await cartService.syncCart(userId, cartForSync);
          set({ lastUser: userId });
        } catch (error) {
          console.error('❌ Error syncing cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      loadCartFromDatabase: async (userId: string) => {
        set({ isSyncing: true });
        try {
          console.log('🔄 Loading cart from database for user:', userId);
          const cartItemsFromDB = await cartService.getCart(userId);

          const formattedCartItems: CartItem[] = cartItemsFromDB
            .map((item) => {
              if (!item.products) return null;
              return {
                id: item.product_id,
                title: item.products.title,
                price: item.products.price,
                images: item.products.images,
                quantity: item.quantity,
                stock: item.products.stock || 0,
              };
            })
            .filter((item) => item !== null) as CartItem[];

          set({
            cartItems: formattedCartItems,
            lastUser: userId,
          });
        } catch (error) {
          console.error('❌ Error loading cart from database:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      handleAuthChange: async (user: { id: string } | null) => {
        if (user) {
          await get().loadCartFromDatabase(user.id);
        } else {
          const { lastUser, cartItems } = get();
          if (lastUser && cartItems.length > 0) {
            await get().syncCartWithDatabase(lastUser);
          }
          set({ lastUser: null });
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartItems: state.cartItems,
        lastUser: state.lastUser,
      }),
    }
  )
);
