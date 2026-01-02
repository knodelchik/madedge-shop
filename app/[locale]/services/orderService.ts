import { supabase } from '../../lib/supabase';

// Типи для TypeScript (щоб все було чітко)
export interface OrderItem {
  id: number;
  product_title: string;
  quantity: number;
  price: number;
  image_url: string;
}

export interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'success' | 'failure' | 'paid';
  shipping_address: any;
  shipping_cost: number;
  shipping_type: string;
  order_items: OrderItem[]; // Масив товарів
}

export const orderService = {
  // createOrder нам тут більше не потрібен для клієнта, 
  // бо ми створюємо замовлення через API route (create-payment)
  
  async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data as Order[];
  }
};