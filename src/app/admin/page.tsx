'use client'

import { useState } from 'react'

export default function DoctorInviteAdminPanel() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const inviteDoctor = async () => {
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/invite-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const result = await res.json()

    if (!res.ok) {
      setMessage(`❌ Error: ${result.error}`)
    } else {
      setMessage(`✅ ${result.message}`)
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
