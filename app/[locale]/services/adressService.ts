import { supabase } from '../../lib/supabase';
import { Address, AddressFormData } from '../../types/address';

export const addressService = {
  // Отримати всі адреси
  async getAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false }) // Спочатку дефолтна
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
    return data || [];
  },

  // Додати адресу
  async addAddress(userId: string, address: AddressFormData): Promise<Address | null> {
    if (address.is_default) {
      // Якщо нова адреса головна, скидаємо інші
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ ...address, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error('Error adding address:', error);
      return null;
    }
    return data;
  },

  // Видалити адресу (Виправлено: тепер приймає userId для додаткової перевірки)
  async deleteAddress(userId: string, id: number): Promise<boolean> {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Гарантуємо, що видаляємо свою адресу

    if (error) {
      console.error('Error deleting address:', error);
      return false;
    }
    return true;
  },

  // Встановити основну адресу (Додано цей метод)
  async setDefaultAddress(userId: string, addressId: number): Promise<boolean> {
    // 1. Знімаємо прапорець з усіх адрес користувача
    const { error: resetError } = await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    if (resetError) {
      console.error('Error resetting default address:', resetError);
      return false;
    }

    // 2. Встановлюємо прапорець для вибраної адреси
    const { error: setError } = await supabase
      .from('user_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId);

    if (setError) {
      console.error('Error setting default address:', setError);
      return false;
    }

    return true;
  }
};