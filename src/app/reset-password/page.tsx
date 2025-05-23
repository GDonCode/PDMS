'use client'
import { useState } from 'react'
import supabase from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage('❌ Failed to reset password.')
      console.error(error)
    } else {
      setMessage('✅ Password updated. Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  return(
    <div className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        className="border p-2 rounded w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handlePasswordReset}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  )
}