import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const userLocale = searchParams.get('locale') || 'uk';

  if (code) {
    const supabase = await createClient();
    // Обмін коду на сесію
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Редірект на клієнтську сторінку успіху з локаллю
      return NextResponse.redirect(`${origin}/${userLocale}/auth/confirm`);
    }
    console.error('Auth error:', error.message);
  }

  // У разі помилки - на сторінку помилки
  return NextResponse.redirect(`${origin}/${userLocale}/auth/auth-code-error`);
}
