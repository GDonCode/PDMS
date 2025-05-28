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

  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (patientError || !patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json({ patient });
}
