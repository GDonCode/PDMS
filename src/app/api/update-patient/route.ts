
import { NextResponse } from 'next/server';
import { cookies }       from 'next/headers';
import { createClient }  from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const updates       = await req.json();       
  console.log('Updates received from frontend:', updates);          // only the editable fields
  const cookieStore   = await cookies();
  const emailCookie   = cookieStore.get('user_email');

  if (!emailCookie)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  // find the user
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id')
    .eq('email', emailCookie.value)
    .select()
    .single();

  if (userErr || !user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // update that user’s patient row
  const { data: updatedPatient, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('user_id', user.id)
    .select()

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  console.log(updatedPatient);
  return NextResponse.json({ message: 'Patient updated successfully' }, { status: 200 });
}
