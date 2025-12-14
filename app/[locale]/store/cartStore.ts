import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { Product } from '../../types/products';
import { toast } from 'sonner'; // <--- Додано для повідомлень

type CartItem = {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity: number;
  stock: number; // <--- Додано поле stock, щоб знати ліміт
};

interface CartStore {
  cartItems: CartItem[];
  isSyncing: boolean;
  lastUser: string | null;

  // Дії
  addToCart: (product: Product & { quantity: number }) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;

  // Синхронізація з базою даних
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

      addToCart: (product) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((item) => item.id === product.id);

        // 1. ПЕРЕВІРКА STOCK
        const currentQty = existingItem ? existingItem.quantity : 0;
        const requestedTotal = currentQty + product.quantity;

        // product.stock може бути undefined, якщо дані прийшли неповні, тому ставимо фолбек
        const limit = product.stock ?? 999; 

        if (requestedTotal > limit) {
          toast.error(`Вибачте, доступно лише ${limit} шт. (У вас в кошику: ${currentQty})`);
          return; // Скасовуємо додавання
        }

        let newCartItems: CartItem[];

        if (existingItem) {
          newCartItems = cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + product.quantity, stock: limit } // Оновлюємо також stock про всяк випадок
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
              stock: limit, // Зберігаємо ліміт
            },
          ];
        }

        set({ cartItems: newCartItems });

        // Синхронізація
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

      updateQuantity: (productId, quantity) => {
        const { cartItems } = get();
        
        // Знаходимо товар, щоб перевірити stock
        const item = cartItems.find(i => i.id === productId);
        if (item && quantity > item.stock) {
           toast.error(`Максимум доступно: ${item.stock} шт.`);
           // Можна форсувати встановлення макс. кількості, або просто ігнорувати
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

      increaseQuantity: (productId: number) => {
        const { cartItems } = get();
        const item = cartItems.find((item) => item.id === productId);

        if (item) {
          // 2. ПЕРЕВІРКА ПРИ ЗБІЛЬШЕННІ
          if (item.quantity >= item.stock) {
             toast.error(`Це вся наявна кількість на складі.`);
             return;
          }
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      decreaseQuantity: (productId: number) => {
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

          console.log('📦 Raw data from database:', cartItemsFromDB);

          const formattedCartItems: CartItem[] = cartItemsFromDB
            .map((item) => {
              if (!item.products) {
                console.error('❌ Missing products data for item:', item);
                return null;
              }

              return {
                id: item.product_id,
                title: item.products.title,
                price: item.products.price,
                images: item.products.images,
                quantity: item.quantity,
                stock: item.products.stock || 0, // <--- 3. Завантажуємо stock з бази
              };
            })
            .filter((item) => item !== null) as CartItem[];

          console.log('✅ Loaded cart items:', formattedCartItems);
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
          console.log('👤 User signed in, loading cart from DB');
          await get().loadCartFromDatabase(user.id);
        } else {
          console.log('👤 User signed out, keeping cart locally');
          const { lastUser, cartItems } = get();

          if (lastUser && cartItems.length > 0) {
            console.log('🔄 Syncing cart before sign out');
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