// app/set-password/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SetPasswordPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) {
      setError('Missing token')
      return
    }

    supabase.auth.exchangeCodeForSession(token).then(({ error }) => {
      if (error) setError(error.message)
    })
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) return setError(error.message)
    router.push('/login')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl mb-4">Set Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        className="input mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading} className="btn">
        {loading ? 'Updating...' : 'Set Password'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </main>
  )
}
