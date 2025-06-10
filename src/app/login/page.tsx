'use client'
import { useEffect, useState } from 'react'
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


  useEffect(() => {
    router.prefetch('/dashboard/doctor')
  }, [])
  useEffect(() => {
    router.prefetch('/dashboard/patient')
  }, [])


  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [patientEmail, setPatientEmail] = useState('')
  const [patientPassword, setPatientPassword] = useState('')
  const [doctorPassword, setDoctorPassword] = useState('')
  const [doctorEmail, setDoctorEmail] = useState('')

  
  const patientLogin= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const errorMessage = document.getElementById("errorMessage")
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
        if (errorMessage) {
          errorMessage.innerHTML = data.error || 'Login failed';
        }
      } else {
        router.push(`/dashboard/${activeTab}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }
  

  const doctorLogin= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
                  ? 'bg-white text-[#45b030] border-b-2 border-[#45b030]'
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
                  ? 'bg-white text-[#45b030] border-b-2 border-[#45b030]'
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
          <div className="p-8 pb-0">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {activeTab === 'patient' && (
              <form className="space-y-6 w-full" onSubmit={patientLogin} >
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring focus:ring-black focus:border-black outline-none transition-all" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} disabled={isLoading}/>
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring focus:ring-black focus:border-black outline-none transition-all" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} disabled={isLoading}/>
                </div>

                <button
                  type="submit"
                  className={isLoading
                    ? 'bg-[#378d27] w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all'
                    : 'w-full py-3 rounded-lg font-medium bg-[#45b030] text-white transition-all'}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  )}
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" className="w-full mx-auto py-3 px-5 rounded-lg font-medium bg-white border transition-all" onClick={() => router.push('/register')}>
                  or Register
                </button>
              </form>
            )}

            {activeTab === 'doctor' && (
              <form className="space-y-6" onSubmit={doctorLogin} >
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring focus:ring-black focus:border-black outline-none transition-all" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg ffocus:ring focus:ring-black focus:border-black outline-none transition-all" value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} />
                </div>

                <button
                  type="submit"
                  className={isLoading
                    ? 'bg-[#378d27] w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all'
                    : 'w-full py-3 rounded-lg font-medium bg-[#45b030] text-white transition-all'}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  )}
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" className="w-full mx-auto py-3 px-5 rounded-lg font-medium bg-white border transition-all" onClick={() => router.push('/register')}>
                  or Register
                </button>
              </form>
            )}

            <p id="errorMessage" className='my-9 text-red-600 text-lg font-semibold mx-auto w-fit'></p>
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