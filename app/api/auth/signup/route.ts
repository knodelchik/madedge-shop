// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json();

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
        emailRedirectTo: 'https://madedge.net/api/auth/callback',
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
