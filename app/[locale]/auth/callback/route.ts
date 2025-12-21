// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // Отримуємо локаль, яку ми передали в signup
  const userLocale = searchParams.get('locale') || 'uk';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ✅ ПЕРЕНАПРАВЛЯЄМО НА СТОРІНКУ УСПІХУ
      return NextResponse.redirect(`${origin}/${userLocale}/auth/confirm`);
    }
    console.error('Callback error:', error.message);
  }

  return NextResponse.redirect(`${origin}/${userLocale}/auth/auth-code-error`);
}
