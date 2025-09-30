import { supabase } from '../lib/supabase';
import { User, AuthFormData } from '../types/users';

export const authService = {
  supabase, // Додаємо доступ до supabase instance

  // Реєстрація
  async signUp({ email, password, full_name }: AuthFormData): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user as any, error: null };
  },

  // Вхід
  async signIn({ email, password }: AuthFormData): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user as any, error: null };
  },

  // Вихід
  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  // Отримати поточного користувача
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error: error.message };
    }

    return { user: user as any, error: null };
  },

  // Отримати профіль користувача
  async getUserProfile(userId: string): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  },

  // Оновити профіль
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  }
};