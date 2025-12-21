// app/[locale]/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  // В Next.js 15 params тепер Promise
  const { locale } = await params;
  const userLocale = locale || 'uk';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Успішна автентифікація - редірект з locale
      return NextResponse.redirect(`${origin}/${userLocale}${next}`);
    }

    console.error('Auth callback error:', error);
  }

  // Якщо помилка - редірект на сторінку помилки з locale
  const errorParam = searchParams.get('error') || 'unknown';
  const errorDesc = searchParams.get('error_description') || '';

  return NextResponse.redirect(
    `${origin}/${userLocale}/auth/auth-code-error?error=${errorParam}&error_description=${errorDesc}`
  );
}
