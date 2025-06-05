import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 5 LOGIN ATTEMPTS per IP PER 10 MINUTES
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 600,
});

export async function POST(req: Request) {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'unknown';

  try {
    // Consume 1 point for this IP
    await rateLimiter.consume(ip);
  } catch {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { email, password, role } = body;

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Complete All Inputs.' }, { status: 400 });
  }

  // Fetch user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User Not Found' }, { status: 401 });
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid Password Entered' }, { status: 401 });
  }

  // Validate role
  if (user.role !== role) {
    return NextResponse.json({ error: `User already registered as a ${user.role}` }, { status: 403 });
  }

  // Set cookie and return success
  const response = NextResponse.json({ message: 'Login Successful', role: user.role }, { status: 200 });

  response.cookies.set('user_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}