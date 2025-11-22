import { supabase } from '../../lib/supabase';
import { User, AuthFormData } from '../../types/users';

export const authService = {
  supabase,

  // Реєстрація
  async signUp({
    email,
    password,
    full_name,
  }: AuthFormData): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    // Приводимо тип через unknown, щоб уникнути помилки TS
    return { user: data.user as unknown as User, error: null };
  },

  // Вхід
  async signIn({
    email,
    password,
  }: AuthFormData): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user as unknown as User, error: null };
  },

  // Вихід
  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  // Отримати поточного користувача
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    if (user) {
      const mappedUser: any = {
        ...user,
        full_name: user.user_metadata?.full_name || '',
        phone: user.phone || user.user_metadata?.phone || '',
      };
      return { user: mappedUser as User, error: null };
    }

    return { user: null, error: null };
  },

  // Отримати профіль користувача
  async getUserProfile(
    userId: string
  ): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Використовуємо maybeSingle, щоб не було помилки JSON, якщо профілю немає

    if (error) {
      console.error('Error fetching profile:', error);
      return { profile: null, error: error.message };
    }

    // Якщо даних немає, повертаємо null, а не помилку
    if (!data) {
      return { profile: null, error: null };
    }

    return { profile: data as unknown as User, error: null };
  },

  // Оновити профіль
  async updateProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: userId, 
        updated_at: new Date().toISOString(),
        ...updates 
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { profile: null, error: error.message };
    }

    return { profile: data as unknown as User, error: null };
  },
};