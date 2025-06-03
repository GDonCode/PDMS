import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const now = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(now.getDate() + 7)

  const formattedNow = now.toISOString().split('T')[0] // 'YYYY-MM-DD'
  const formattedNextWeek = oneWeekFromNow.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('appointment_date', formattedNow)
    .lte('appointment_date', formattedNextWeek)
    .eq('appointment_status', 'confirmed')
    .order('appointment_date', { ascending: true })

  if (error) {
    console.error('Error fetching upcoming appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }

  return NextResponse.json(data)
}