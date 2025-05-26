'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import supabase from '@/app/lib/supabaseClient'
import Script from 'next/script'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-montserrat'
})

export default function Register() {
  //Vanta BG
  useEffect(() => {
    if (typeof window !== 'undefined' && window.VANTA && window.VANTA.CELLS) {
      window.VANTA.CELLS({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00
      })
    }
  }, [])

  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient')

  // Common
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Patient
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  // Doctor
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctorPassword, setDoctorPassword] = useState('')
  const [doctorFirstName, setDoctorFirstName] = useState('')
  const [doctorLastName, setDoctorLastName] = useState('')

  const handleSendOTP = async () => {
    if (!phone || !password) {
      setError('Please enter your phone number and password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
          data: { password } // save password in user metadata if needed
        }
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setStep('otp')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    setError('')

    const { data: session, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    const user = session?.user
    if (!user) {
      setError("User verification succeeded but user data is missing.")
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("patients").insert([
      {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    ])

    if (insertError) {
      setError("User verified but failed to create patient record.")
      console.error(insertError)
    } else {
      router.push("/patient/dashboard")
    }

    setIsLoading(false)
  }

  const handleDoctorRegister = async () => {
    if (!doctorEmail || !doctorPassword || !doctorFirstName || !doctorLastName) {
      setError("Please fill out all fields.")
      return
    }

    setIsLoading(true)
    setError("")

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: doctorEmail,
      password: doctorPassword,
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    const user = data?.user
    if (!user) {
      setError("Account created but user object is missing.")
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("doctors").insert([
      {
        id: user.id,
        first_name: doctorFirstName,
        last_name: doctorLastName,
        email: doctorEmail,
      },
    ])

    if (insertError) {
      setError("User created but failed to save doctor info.")
      console.error(insertError)
    } else {
      router.push("/doctor/dashboard")
    }

    setIsLoading(false)
  }

  return (
  <>
  <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" strategy="beforeInteractive" />
  <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js" strategy="afterInteractive" />
    <div className={`${montserrat.className} gradient-background min-h-screen flex items-center justify-center p-4`} id="vanta-bg">
      <div className="max-w-[45rem] w-full">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Elysian Health Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-white">Take control of your health.</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
          <div className="flex justify-center border-b border-slate-100">
            <button
              className={`w-1/2 py-4 font-semibold ${activeTab === 'patient' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500'}`}
              onClick={() => {
                setActiveTab('patient')
                setError('')
              }}
            >
              Patient Registration
            </button>
            <button
              className={`w-1/2 py-4 font-semibold ${activeTab === 'doctor' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500'}`}
              onClick={() => {
                setActiveTab('doctor')
                setError('')
              }}
            >
              Doctor Registration
            </button>
          </div>

          <div className="p-8">
            {error && <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

            {activeTab === 'patient' && (
              <div className="space-y-6">
                {step === 'phone' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Phone</label>
                      <input
                        className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all"
                        placeholder="+1..."
                        value={phone}
                        onChange={(e) => {
                          let input = e.target.value
                          if (!input.startsWith("+")) input = "+" + input.replace(/[^0-9]/g, "")
                          setPhone(input)
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Password</label>
                      <input type="password" className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button className="w-full py-3 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all" onClick={handleSendOTP} disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium">Verification Code</label>
                      <input className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all" value={otp} onChange={(e) => setOtp(e.target.value)} />
                      <p className="text-xs mt-2 text-slate-500">Sent to {phone}</p>
                    </div>

                    <button className="button-primary" onClick={handleVerifyOTP} disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify & Register"}
                    </button>

                    <button className="text-blue-600 text-sm mt-2" onClick={() => setStep('phone')}>
                      Change phone number
                    </button>
                  </>
                )}
              </div>
            )}

            {activeTab === 'doctor' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
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

                <button className="w-full py-3 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all" onClick={handleDoctorRegister} disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register as Doctor'}
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
