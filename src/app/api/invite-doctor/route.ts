// /app/api/invite-doctor.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const { first_name, last_name, email, specialization } = await req.json()

  if (!email || !first_name) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Create user
  const { data: user, error: userError } = await supabase.auth.admin.inviteUserByEmail(email)

  if (userError || !user?.user?.id) {
    return NextResponse.json({ error: userError?.message || 'User creation failed' }, { status: 500 })
  }

  // 2. Insert doctor profile
  const { error: doctorError } = await supabase
    .from('doctors')
    .insert({
      first_name,
      last_name,
      email,
      specialization,
      status: 'pending',
      id: user.user.id
    })

  if (doctorError) {
    return NextResponse.json({ error: doctorError.message }, { status: 500 })
  }

  return NextResponse.json({ message: `Doctor invited: ${email}` })
}
