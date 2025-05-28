'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-montserrat'
})

export default function Register() {

  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient')

  // Common
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Patient
  const [patientFirstName, setPatientFirstName] = useState('')
  const [patientLastName, setPatientLastName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPassword, setPatientPassword] = useState('')

  // Doctor
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctorPassword, setDoctorPassword] = useState('')
  const [doctorFirstName, setDoctorFirstName] = useState('')
  const [doctorLastName, setDoctorLastName] = useState('')

  const RegisterNewDoctor = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: doctorFirstName,
          lastName: doctorLastName,
          email: doctorEmail,
          password: doctorPassword,
          role: activeTab,
        }),
      });

      console.log('Raw response:', res);
      const text = await res.text();
      console.log('Raw response text:', text);
      
      router.push(`/dashboard/${activeTab}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }
  
  const RegisterNewPatient= async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: patientFirstName,
          lastName: patientLastName,
          email: patientEmail,
          password: patientPassword,
          role: activeTab, 
        }),
      });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    router.push(`/dashboard/${activeTab}`);

    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
  <>
    <div className={`${montserrat.className} gradient-background min-h-screen flex items-center justify-center p-4`} id="vanta-bg">
      <div className="max-w-[45rem] w-full">
        <div className="text-center mb-8">
          <Link href='/'>
            <Image src="/logo.png" alt="Elysian Health Logo" width={80} height={80} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-semibold text-white">Take control of your health.</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
          <div className="flex justify-center border-b border-slate-100">
            <button
              className={`w-1/2 py-4 font-semibold ${activeTab === 'patient' ? 'bg-white text-blue-700 border-b-2 border-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              onClick={() => {
                setActiveTab('patient')
                setError('')
              }}
            >
              Register as Patient
            </button>
            <button
              className={`w-1/2 py-4 font-semibold ${activeTab === 'doctor' ? 'bg-white text-blue-700 border-b-2 border-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              onClick={() => {
                setActiveTab('doctor')
                setError('')
              }}
            >
              Register as Doctor
            </button>
          </div>

          <div className="p-8">
            
            {error && <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
            
            {/* PATIENT TAB */}
            {activeTab === 'patient' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={patientFirstName} onChange={(e) => setPatientFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={patientLastName} onChange={(e) => setPatientLastName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-7500 focus:border-blue-700 outline-none transition-all" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} />
                </div>

                <button className="w-full py-3 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all" onClick={RegisterNewPatient} disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            )}


            {/* DOCTOR TAB */}
            {activeTab === 'doctor' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={doctorFirstName} onChange={(e) => setDoctorFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={doctorLastName} onChange={(e) => setDoctorLastName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-7500 focus:border-blue-700 outline-none transition-all" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} />
                </div>

                <button className="w-full py-3 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all" onClick={RegisterNewDoctor} disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            )}

          </div>

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
            © 2025 Omega Medical. All rights reserved.
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300">
            Already have an account? <a href="/login" className="text-white underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  </>
  )
}
