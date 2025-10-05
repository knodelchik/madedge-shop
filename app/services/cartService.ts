import { supabase } from '../lib/supabase';
import { CartItemWithProduct } from '../types/cart';

export const cartService = {
  // Отримати корзину користувача
  async getCart(userId: string): Promise<CartItemWithProduct[]> {
    console.log('🛒 Fetching cart for user:', userId);
    
    try {
      const { data, error, status } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      console.log('📊 Get cart - Status:', status, 'Data:', data);
      
      if (error) {
        console.error('❌ Full cart error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return [];
      }

      console.log('✅ Cart fetched successfully. Items:', data?.length || 0);
      return (data || []) as CartItemWithProduct[];
    } catch (err) {
      console.error('❌ Unexpected error in getCart:', err);
      return [];
    }
  },

  // Додати товар в корзину
  async addToCart(userId: string, productId: number, quantity: number = 1): Promise<boolean> {
    console.log('🛒 Adding to cart:', { userId, productId, quantity });
    
    try {
      const { error, status, data } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity: quantity
        }, {
          onConflict: 'user_id,product_id'
        });

      console.log('📊 Add to cart - Status:', status, 'Data:', data);

      if (error) {
        console.error('❌ Full error adding to cart:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return false;
      }

      console.log('✅ Item added to cart successfully');
      return true;
    } catch (err) {
      console.error('❌ Unexpected error in addToCart:', err);
      return false;
    }
  },

  // Оновити кількість товару
  async updateQuantity(userId: string, productId: number, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error updating cart quantity:', error);
      return false;
    }

    return true;
  },

  // Видалити товар з корзини
  async removeFromCart(userId: string, productId: number): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from cart:', error);
      return false;
    }

    return true;
  },

  // Очистити корзину
  async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }

    return true;
  },

  // Синхронізувати локальну корзину з базою даних
  async syncCart(userId: string, localCart: { productId: number; quantity: number }[]): Promise<boolean> {
    console.log('🔄 Syncing cart for user:', userId, 'items:', localCart);
    
    try {
      // Спочатку очищаємо корзину
      await this.clearCart(userId);

      // Потім додаємо всі товари
      for (const item of localCart) {
        const success = await this.addToCart(userId, item.productId, item.quantity);
        if (!success) {
          console.error('❌ Failed to add item during sync:', item);
          return false;
        }
      }

      console.log('✅ Cart synced successfully');
      return true;
    } catch (error) {
      console.error('❌ Error syncing cart:', error);
      return false;
    }
  }
};