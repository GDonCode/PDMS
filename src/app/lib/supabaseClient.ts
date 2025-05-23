
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gutcidjlgjbbthufaaks.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dGNpZGpsZ2piYnRodWZhYWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTc4NjEsImV4cCI6MjA2Mjk5Mzg2MX0.9gWSBOaVQIdQ7CfOMlsFIHYPhK0nb_Chfixpo4f0C68'

// Create a single instance of the supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase