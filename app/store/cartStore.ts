import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { Product } from '../types/products';

type CartItem = {
    id: number;
    title: string;
    price: number;
    images: string[];
    quantity: number;
};

interface CartStore {
    cartItems: CartItem[];
    isSyncing: boolean;
    lastUser: string | null;

    // Дії
    addToCart: (product: Product & { quantity: number }) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    increaseQuantity: (productId: number) => void; // ДОДАЄМО
    decreaseQuantity: (productId: number) => void; // ДОДАЄМО
    clearCart: () => void;

    // Синхронізація з базою даних
    syncCartWithDatabase: (userId: string) => Promise<void>;
    loadCartFromDatabase: (userId: string) => Promise<void>;
    handleAuthChange: (user: any | null) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cartItems: [],
            isSyncing: false,
            lastUser: null,

            addToCart: (product) => {
                const { cartItems, lastUser } = get();
                const existingItem = cartItems.find(item => item.id === product.id);

                let newCartItems: CartItem[];

                if (existingItem) {
                    newCartItems = cartItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + product.quantity }
                            : item
                    );
                } else {
                    newCartItems = [...cartItems, {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        images: product.images,
                        quantity: product.quantity
                    }];
                }

                set({ cartItems: newCartItems });

                // Синхронізація з базою даних, якщо користувач авторизований
                const syncWithDB = async () => {
                    const { user } = await authService.getCurrentUser();
                    if (user) {
                        console.log('🔄 Syncing add to cart for user:', user.id);
                        await cartService.addToCart(user.id, product.id,
                            existingItem ? existingItem.quantity + product.quantity : product.quantity
                        );
                    }
                };

                syncWithDB();
            },

            removeFromCart: (productId) => {
                const { cartItems } = get();
                const newCartItems = cartItems.filter(item => item.id !== productId);
                set({ cartItems: newCartItems });

                // Синхронізація з базою даних
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
                const newCartItems = cartItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                ).filter(item => item.quantity > 0);

                set({ cartItems: newCartItems });

                // Синхронізація з базою даних
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

            // ДОДАЄМО ФУНКЦІЇ ДЛЯ ЗБІЛЬШЕННЯ/ЗМЕНШЕННЯ
            increaseQuantity: (productId: number) => {
                const { cartItems, updateQuantity } = get();
                const item = cartItems.find(item => item.id === productId);

                if (item) {
                    updateQuantity(productId, item.quantity + 1);
                }
            },

            decreaseQuantity: (productId: number) => {
                const { cartItems, updateQuantity } = get();
                const item = cartItems.find(item => item.id === productId);

                if (item && item.quantity > 1) {
                    updateQuantity(productId, item.quantity - 1);
                } else if (item && item.quantity === 1) {
                    // Якщо кількість 1, то видаляємо товар
                    get().removeFromCart(productId);
                }
            },

            clearCart: () => {
                set({ cartItems: [] });

                // Синхронізація з базою даних
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
                    const cartForSync = cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
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

                    const formattedCartItems: CartItem[] = cartItemsFromDB.map(item => {
                        console.log('🔍 Processing item:', item);

                        // Перевірка чи products існує
                        if (!item.products) {
                            console.error('❌ Missing products data for item:', item);
                            return null;
                        }

                        return {
                            id: item.product_id,
                            title: item.products.title,
                            price: item.products.price,
                            images: item.products.images,
                            quantity: item.quantity
                        };
                    }).filter(item => item !== null) as CartItem[]; // Фільтруємо null значення

                    console.log('✅ Loaded cart items:', formattedCartItems);
                    set({
                        cartItems: formattedCartItems,
                        lastUser: userId
                    });
                } catch (error) {
                    console.error('❌ Error loading cart from database:', error);
                } finally {
                    set({ isSyncing: false });
                }
            },

            handleAuthChange: async (user: any) => {
                if (user) {
                    // Користувач увійшов - завантажуємо корзину з бази
                    console.log('👤 User signed in, loading cart from DB');
                    await get().loadCartFromDatabase(user.id);
                } else {
                    // Користувач вийшов - зберігаємо локально
                    console.log('👤 User signed out, keeping cart locally');
                    const { lastUser, cartItems } = get();

                    // Якщо були товари в корзині, синхронізуємо перед виходом
                    if (lastUser && cartItems.length > 0) {
                        console.log('🔄 Syncing cart before sign out');
                        await get().syncCartWithDatabase(lastUser);
                    }

                    set({ lastUser: null });
                }
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                cartItems: state.cartItems,
                lastUser: state.lastUser
            }),
        }
    )
);