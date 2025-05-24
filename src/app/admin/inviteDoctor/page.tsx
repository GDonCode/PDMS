
'use client'
import { useState } from 'react'

export default function InviteDoctorForm() {
  const [form, setForm] = useState({ first_name: '',last_name: '', email: '', specialization: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/invite-doctor', {
      method: 'POST',
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setMessage(data.message || data.error)
    setLoading(false)
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-2">Add Doctor</h2>
      <input name="first_name" placeholder="First Name" onChange={handleChange} className="w-full p-2 mb-2 border border-gray-300 rounded" />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} className="w-full p-2 mb-2 border border-gray-300 rounded" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-2 border border-gray-300 rounded" />
      <input name="specialization" placeholder="Specialization" onChange={handleChange} className="w-full p-2 mb-2 border border-gray-300 rounded" />
      <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
        {loading ? 'Inviting...' : 'Send Invite'}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
