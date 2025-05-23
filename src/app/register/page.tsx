'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import supabase from '@/app/lib/supabaseClient'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})


export default function Register() {
  const [tab, setTab] = useState('patient')
  const router = useRouter()

  // Patient registration
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // or 'verify'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter your phone number')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true }
      })

      if (supabaseError) {
        setError(supabaseError.message)
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
    setError("")

    const { data: session, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    const user = session.user

    if (!user) {
      setError("User verification succeeded but user data is missing.")
      setIsLoading(false)
      return
    }

    // Insert into patients table
    const { error: insertError } = await supabase.from("patients").insert([
      {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      },
    ])

    if (insertError) {
      setError("User verified but failed to create patient record.")
      console.error(insertError)
      setIsLoading(false)
      return
    }

    // Success — continue
    console.log("Patient registered successfully")
    router.push("/patient/dashboard") // or wherever you want
  }

  return (
    <div className={`${montserrat.className} min-h-screen gradient-background flex items-center justify-center p-4`}>
      <div className="max-w-[45rem] w-full relative z-10">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Elysian Health Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-white">Take control of your health.</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-8">
                Create Your Account
              </h2>

              {step === 'phone' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">First Name</label>
                        <input
                          className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Last Name</label>
                        <input
                          className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="+1 (000) 000-0000"
                      value={phone}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (!input.startsWith("+")) {
                          input = "+" + input.replace(/[^0-9]/g, "");
                        }
                        setPhone(input);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input
                      type="password"
                      className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      isLoading ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-700 text-white hover:bg-blue-800'
                    }`}
                    onClick={handleSendOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Verification Code</label>
                    <input
                      className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-2">A verification code has been sent to {phone}</p>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <button
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        isLoading ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-700 text-white hover:bg-blue-800'
                      }`}
                      onClick={handleVerifyOTP}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Register'}
                    </button>

                    <button
                      className="text-blue-700 text-sm hover:text-blue-800 transition-colors"
                      onClick={() => {
                        setStep('phone');
                        setError('');
                      }}
                    >
                      Change phone number
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
            <p className="text-center text-xs text-slate-500">© 2025 Omega Medical. All rights reserved.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300">
            Already have an account?{' '}
            <a href="/login" className="text-white underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
