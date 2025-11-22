// app/[locale]/services/orderService.ts
import { supabase } from '../../lib/supabase';
import { CartItem } from '@/app/types/cart'; // Використаємо ваш існуючий тип
type Address = any; // (Використайте тип з addressService)
type Order = any; // (Використайте згенерований тип)

export const orderService = {

  async createOrder(
    userId: string,
    items: CartItem[],
    totalAmount: number,
    shippingAddress: Address 
  ): Promise<Order | null> {
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        items: items as any, // Supabase очікує jsonb
        shipping_address: shippingAddress as any, // Supabase очікує jsonb
        status: 'pending' // Початковий статус
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }
    return data;
  },
  
  async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data;
  }
};