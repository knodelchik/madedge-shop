import { supabase } from '../lib/supabase';
import { WishlistItemWithProduct } from '../types/wishlist';

export const wishlistService = {
  // Отримати список бажань
  async getWishlist(userId: string): Promise<WishlistItemWithProduct[]> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    return data as WishlistItemWithProduct[];
  },

  // Додати в список бажань
  async addToWishlist(userId: string, productId: number): Promise<boolean> {
    const { error } = await supabase
      .from('wishlist_items')
      .upsert({
        user_id: userId,
        product_id: productId
      }, {
        onConflict: 'user_id,product_id'
      });

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  },

  // Видалити з списку бажань
  async removeFromWishlist(userId: string, productId: number): Promise<boolean> {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  },

  // Перевірити чи товар в списку бажань
  async isInWishlist(userId: string, productId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  },

  // Перемістити з wishlist в cart
  async moveToCart(userId: string, productId: number): Promise<boolean> {
    try {
      // Додаємо в корзину
      const cartService = await import('./cartService');
      const success = await cartService.cartService.addToCart(userId, productId, 1);
      
      if (success) {
        // Видаляємо з wishlist
        await this.removeFromWishlist(userId, productId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error moving to cart:', error);
      return false;
    }
  }
};