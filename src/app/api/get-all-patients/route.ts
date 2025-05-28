import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('patients')
    .select('user_id, first_name, last_name, date_of_birth, age, sex, offspring, race, nationality, height, weight, bmi, blood_pressure, blood_type, resting_heart_rate');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ patients: data }, { status: 200 });
}