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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(() => {
          setReady(true)
          window.history.replaceState(null, '', window.location.pathname)
        })
        .catch(() => setError('Failed to authenticate. Try again.'))
    } else {
      setError('Invalid link. Please use the latest email.')
    }
  }, [supabase])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({
      password,
      data: { has_password: true },
    })
    setLoading(false)

    if (error) return setError(error.message)

    // Redirect to dashboard after setting password
    router.push('/dashboard')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl mb-4">Set Your Password</h2>

      {!ready && !error && <p>Loading...</p>}

      {ready && (
        <>
          <input
            type="password"
            placeholder="New Password"
            className="input mb-2 p-2 border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={loading} className="btn p-2 bg-blue-600 text-white">
            {loading ? 'Updating...' : 'Set Password'}
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </main>
  )
}
