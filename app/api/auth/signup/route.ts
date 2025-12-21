// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // або anon, якщо без insert у users
);

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: 'https://madedge.net/api/auth/callback',
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: data.user,
    });
  } catch (e) {
    console.error('SIGNUP API ERROR:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
