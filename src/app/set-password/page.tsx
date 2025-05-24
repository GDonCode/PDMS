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
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const accessToken = params.get('access_token')

    if (accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '' // Not needed for password update
      }).catch((e) => {
        console.error(e)
        setError('Failed to authenticate. Try the link again.')
      })
    } else {
      setError('No access token found. Please use the email link.')
    }
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
