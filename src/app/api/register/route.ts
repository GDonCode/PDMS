import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const {firstName, lastName, email, password, role } = body;

  if (!email || !password || !firstName || !lastName || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //PREVENT DUPLICATE RECORDS
  const { data: existingUser} = await supabase
  .from('users')
  .select('id')
  .eq('email', email)
  .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: 'Email is already registered' }, { status: 409 }); // 409 Conflict
  }


  const { data: user, error: userError } = await supabase
    .from('users')
    .insert([{ email, password: hashedPassword, role: role}])
    .select()
    .single();

  if (userError) {
    console.error('User insert error:', userError);
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  if (role === 'doctor') {
    const { error: docError } = await supabase
      .from('doctors')
      .insert([{ first_name: firstName, last_name: lastName, user_id: user.id}]);

    if (docError) {
      console.error('Doctor insert error:', docError);
      return NextResponse.json({ error: docError.message }, { status: 400 });
    }
  } else if (role === 'patient') {
    const { error: patError } = await supabase
      .from('patients')
      .insert([{ first_name: firstName, last_name: lastName, user_id: user.id}]);

    if (patError) {
      console.error('Patient insert error:', patError);
      return NextResponse.json({ error: patError.message }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  
  const response = NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  response.cookies.set('user_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
