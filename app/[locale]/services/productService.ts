import { supabase } from '../../lib/supabase';
import { Product } from '../../types/products';

export const productsService = {
  async getAllProducts(): Promise<Product[]> {
    console.log('Fetching products from Supabase...');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');

    if (error) {
      console.error('Full Supabase error:', error);
      return [];
    }

    // Тепер images вже JSONB масив - просто повертаємо дані
    console.log('Products fetched successfully:', data?.length || 0);
    return data || [];
  },

  async getProductsByCategory(
    category: Product['category']
  ): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('id');

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return data || [];
  },

  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  },

  async getProductByTitle(title: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('title', title)
      .single();

    if (error) {
      console.error('Error fetching product by title:', error);
      return null;
    }

    return data;
  },
};
