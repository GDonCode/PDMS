import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export default function DoctorInviteAdminPanel() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const inviteDoctor = async () => {
    setLoading(true)
    setMessage(null)

    if (!email) {
      setMessage('Please enter a valid email')
      setLoading(false)
      return
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

    if (error) {
      console.error('Error inviting doctor:', error.message)
      setMessage(`❌ Error: ${error.message}`)
    } else {
      console.log('Invite sent:', data)
      setMessage(`✅ Invite sent to ${email}`)
    }

    setEmail('')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Invite Doctor</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="doctor@example.com"
        className="w-full px-4 py-2 mb-4 border rounded"
      />
      <button
        onClick={inviteDoctor}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Invite'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}
