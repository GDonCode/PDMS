import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const cookieStore = await cookies();
  const emailCookie = cookieStore.get('user_email');

  if (!emailCookie) {
    return NextResponse.json({ error: 'No user cookie found' }, { status: 401 });
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', emailCookie.value)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { data: doctor, error: doctorError } = await supabase
    .from('doctors')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (doctorError || !doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  }

  return NextResponse.json(doctor);
}
