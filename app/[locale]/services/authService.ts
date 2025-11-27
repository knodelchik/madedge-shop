import { supabase } from '../../lib/supabase';
import { User, AuthFormData } from '../../types/users';
import { Session } from '@supabase/supabase-js';

export const authService = {
  supabase,

  // === РЕЄСТРАЦІЯ (Через власний API + Resend) ===
  async signUp({
    email,
    password,
    full_name,
  }: AuthFormData): Promise<{ user: User | null; session: Session | null; error: string | null }> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { user: null, session: null, error: data.error || 'Помилка реєстрації' };
      }

      // При ручній реєстрації через Admin API сесія не створюється автоматично.
      // Користувач має підтвердити пошту.
      return { 
        user: data.user as unknown as User, 
        session: null, 
        error: null 
      };
    } catch (e) {
      console.error('SignUp Error:', e);
      return { user: null, session: null, error: 'Помилка з\'єднання з сервером' };
    }
  },

  // === ВХІД (Стандартний Supabase) ===
  async signIn({
    email,
    password,
  }: AuthFormData): Promise<{ user: User | null; session: Session | null; error: string | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { 
      user: data.user as unknown as User, 
      session: data.session, 
      error: null 
    };
  },

  // === ВИХІД ===
  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  // === ОТРИМАННЯ ПОТОЧНОГО КОРИСТУВАЧА (Auth + Database Profile) ===
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    // 1. Отримуємо юзера з сесії
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    if (user) {
      // 2. Підтягуємо додаткові дані з таблиці public.users (роль, телефон і т.д.)
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // 3. Об'єднуємо дані (пріоритет у профілю з бази)
      const mappedUser: any = {
        ...user,
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        phone: profile?.phone || user.phone || '',
        email_confirmed_at: user.email_confirmed_at || null,
        role: profile?.role || 'user', // Важливо для адмінки
      };

      return { user: mappedUser as User, error: null };
    }

    return { user: null, error: null };
  },

  // === ОТРИМАННЯ ПРОФІЛЮ (Тільки база) ===
  async getUserProfile(userId: string): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) return { profile: null, error: error.message };
    // Якщо профілю немає, повертаємо null, це не помилка
    return { profile: data as unknown as User, error: null };
  },

  // === ОНОВЛЕННЯ ПРОФІЛЮ (Upsert) ===
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

  // === ВІДНОВЛЕННЯ ПАРОЛЮ (Через власний API + Resend) ===
  async resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Не вдалося відправити лист' };
      }

      return { error: null };
    } catch (e) {
      return { error: 'Помилка з\'єднання з сервером' };
    }
  },

  // === ОНОВЛЕННЯ ПАРОЛЮ (Коли юзер вже залогінений) ===
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error: error?.message || null };
  },

  // === ПОВТОРНЕ ПІДТВЕРДЖЕННЯ ПОШТИ (Через власний API + Resend) ===
  async resendVerificationEmail(email: string): Promise<{ error: string | null }> {
    try {
      // Ми використовуємо той самий API, що і для відновлення, або спеціальний
      // Якщо ви створили route /api/auth/resend, використовуємо його
      const res = await fetch('/api/auth/resend', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Не вдалося відправити лист' };
      }
      
      return { error: null };
    } catch (e) {
       return { error: 'Помилка з\'єднання з сервером' };
    }
  }
  
};