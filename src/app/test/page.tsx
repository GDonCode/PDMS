'use client'
import supabase from '@/app/lib/supabaseClient'
export default function Test() {
    const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('first_name')
      .limit(1);

    
    if (error) {
      console.error('Test query error:', error);
    } else {
      console.log('Connection successful, data:', data);
    }
  } catch (e) {
    console.error('Test connection exception:', e);
  }
};
    return (
        <div>
            <h1>Test Supabase Connection</h1>
            <button onClick={testConnection}>Test Connection Now</button>
        </div>
    )
}