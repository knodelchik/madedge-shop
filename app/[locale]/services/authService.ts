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
    // 1. Отримуємо користувача з Auth (email, id)
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    if (user) {
      // 2. Отримуємо додаткові дані з public.users (role, name, phone)
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // 3. Об'єднуємо дані
      const mappedUser: any = {
        ...user,
        // Якщо профіль є - беремо дані з нього, якщо ні - з метаданих
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        phone: profile?.phone || user.phone || '',
        email_confirmed_at: user.email_confirmed_at || null,
        role: profile?.role || 'user', // <--- ОСЬ ТУТ МИ ОТРИМУЄМО РОЛЬ
      };

      return { user: mappedUser as User, error: null };
    }

    return { user: null, error: null };
  },

  // Отримати профіль користувача
  async getUserProfile(userId: string): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) return { profile: null, error: error.message };
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

  async resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/update-password`
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    return { error: error?.message || null };
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error: error?.message || null };
  },

  async resendVerificationEmail(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined
      }
    });

    return { error: error?.message || null };
  }
  
};