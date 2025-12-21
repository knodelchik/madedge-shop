import { supabase } from '../../lib/supabase';
import { User, AuthFormData } from '../../types/users';
import { Session } from '@supabase/supabase-js';

export const authService = {
  supabase,

  // === РЕЄСТРАЦІЯ (Оновлено) ===
  async signUp({
    email,
    password,
    full_name,
    lang, // <--- 1. Деструктуризуємо lang
  }: AuthFormData): Promise<{
    user: User | null;
    session: Session | null;
    error: string | null;
  }> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Передаємо lang на сервер
        body: JSON.stringify({ email, password, full_name, lang }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          user: null,
          session: null,
          error: data.error || 'Помилка реєстрації',
        };
      }

      return {
        user: data.user as unknown as User,
        session: null,
        error: null,
      };
    } catch (e) {
      console.error('SignUp Error:', e);
      return {
        user: null,
        session: null,
        error: "Помилка з'єднання з сервером",
      };
    }
  },

  // === ВХІД (Без змін, Supabase сам хендлить це) ===
  async signIn({
    email,
    password,
  }: AuthFormData): Promise<{
    user: User | null;
    session: Session | null;
    error: string | null;
  }> {
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
      error: null,
    };
  },

  // === ВИХІД ===
  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  // === ОТРИМАННЯ ПОТОЧНОГО КОРИСТУВАЧА ===
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const mappedUser: any = {
        ...user,
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        phone: profile?.phone || user.phone || '',
        email_confirmed_at: user.email_confirmed_at || null,
        role: profile?.role || 'user',
      };

      return { user: mappedUser as User, error: null };
    }

    return { user: null, error: null };
  },

  // === ОТРИМАННЯ ПРОФІЛЮ ===
  async getUserProfile(
    userId: string
  ): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) return { profile: null, error: error.message };
    return { profile: data as unknown as User, error: null };
  },

  // === ОНОВЛЕННЯ ПРОФІЛЮ ===
  async updateProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<{ profile: User | null; error: string | null }> {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        updated_at: new Date().toISOString(),
        ...updates,
      })
      .select()
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data as unknown as User, error: null };
  },

  // === ВІДНОВЛЕННЯ ПАРОЛЮ (Оновлено) ===
  // Додаємо другий аргумент lang
  async resetPasswordForEmail(
    email: string,
    lang?: string
  ): Promise<{ error: string | null }> {
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Передаємо lang у тілі запиту
        body: JSON.stringify({ email, lang }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Не вдалося відправити лист' };
      }

      return { error: null };
    } catch (e) {
      return { error: "Помилка з'єднання з сервером" };
    }
  },

  // === ОНОВЛЕННЯ ПАРОЛЮ ===
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error: error?.message || null };
  },

  // === ПОВТОРНЕ ПІДТВЕРДЖЕННЯ ПОШТИ (Оновлено) ===
  async resendVerificationEmail(
    email: string,
    lang?: string
  ): Promise<{ error: string | null }> {
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }), // Передаємо мову
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Не вдалося відправити лист' };
      }

      return { error: null };
    } catch (e) {
      return { error: "Помилка з'єднання з сервером" };
    }
  },
};
