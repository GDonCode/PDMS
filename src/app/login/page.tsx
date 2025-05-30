'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})

export default function Login() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [patientEmail, setPatientEmail] = useState('')
  const [patientPassword, setPatientPassword] = useState('')
  const [doctorPassword, setDoctorPassword] = useState('')
  const [doctorEmail, setDoctorEmail] = useState('')

  const patientLogin= async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: patientEmail,
          password: patientPassword,
          role: activeTab, 
        }),
      });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    router.push(`/dashboard/${activeTab}`);

    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const doctorLogin= async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: doctorEmail,
          password: doctorPassword,
          role: activeTab, 
        }),
      });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    router.push(`/dashboard/${activeTab}`);

    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`${montserrat.className} min-h-screen gradient-background flex items-center justify-center p-4`}>
      <div className="max-w-2xl w-full relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <Link href='/'>
            <Image src="/logo.png" alt="Elysian Health Logo" width={80} height={80} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-semibold text-white">Patient Data Management System</h1>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
          {/* Tab Selection */}
          <div className="flex">
            <button
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'patient'
                  ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
              onClick={() => {
                setActiveTab('patient')
                setError('')
              }}
            >
              Patient Access
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'doctor'
                  ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
              onClick={() => {
                setActiveTab('doctor')
                setError('')
              }}
            >
              Physician Portal
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {activeTab === 'patient' && (
              <div className="space-y-6 w-full">
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-7500 focus:border-blue-700 outline-none transition-all" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} />
                </div>

                <button className="w-full py-3 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all" onClick={patientLogin} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button className="w-fit mx-auto py-3 px-5 rounded-lg font-medium bg-white border border-blue-700 text-bg-blue-700 transition-all" onClick={() => router.push('/register')}>
                  or Register
                </button>
              </div>
            )}

            {activeTab === 'doctor' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-7500 focus:border-blue-700 outline-none transition-all" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} />
                </div>

                <button className="w-full py-3 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all" onClick={doctorLogin} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button className="w-full py-1 rounded-lg font-medium bg-white text-bg-blue-700 transition-all underline" onClick={() => router.push('/register')}>
                  or Register
                </button>
              </div>
            )}

          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
            <p className="text-center text-xs text-slate-500">
              © 2025 Omega Medical. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300">
            Don&rsquo;t have an account?{' '}
            <a href="/register" className="text-white underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}