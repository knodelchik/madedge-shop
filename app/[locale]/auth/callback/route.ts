// app/[locale]/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';
  const locale = params.locale || 'uk';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Успішна автентифікація - редірект з locale
      return NextResponse.redirect(`${origin}/${locale}${next}`);
    }

    console.error('Auth callback error:', error);
  }

  // Якщо помилка - редірект на сторінку помилки з locale
  return NextResponse.redirect(
    `${origin}/${locale}/auth/auth-code-error?error=${
      searchParams.get('error') || 'unknown'
    }&error_description=${searchParams.get('error_description') || ''}`
  );
}
