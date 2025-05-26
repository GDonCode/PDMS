'use client'
import { useState } from 'react'
import supabase from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})

export default function Login() {
  const [tab, setTab] = useState('patient')
  const router = useRouter()

  // Patient state
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Doctor state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter your phone number')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const { error: supabaseError } = await supabase.auth.signInWithOtp({ phone })
      if (supabaseError) {
        setError(supabaseError.message)
      } else {
        setStep('otp')
      }
    } catch (error) {
      console.error('Unexpected error during OTP send:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the verification code')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const { error: supabaseError } = await supabase.auth.verifyOtp({ 
        phone, 
        token: otp, 
        type: 'sms' 
      })
      
      if (supabaseError) {
        setError(supabaseError.message)
      } else {
        router.push('/dashboard/patient')
      }
    } catch (error) {
      console.error('Unexpected error during OTP send:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (supabaseError) {
        setError(supabaseError.message)
      } else {
        router.push('/dashboard/doctor')
      }
    } catch (error) {
      console.error('Unexpected error during OTP send:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })

    if (error) {
      alert('Error sending reset link.')
      console.error(error)
    } else {
      alert('Password reset email sent. Check your inbox.')
    }
  }

  return (
    <div className={`${montserrat.className} min-h-screen gradient-background flex items-center justify-center p-4`}>
      <div className="max-w-2xl w-full relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <Image 
            src="/logo.png"
            alt="Elysian Health Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-semibold text-white">Patient Data Management System</h1>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
          {/* Tab Selection */}
          <div className="flex">
            <button
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                tab === 'patient'
                  ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
              onClick={() => {
                setTab('patient')
                setError('')
              }}
            >
              Patient Access
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                tab === 'doctor'
                  ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
              onClick={() => {
                setTab('doctor')
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
            
            {tab === 'patient' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  {step === 'phone' ? 'Enter Your Mobile Number' : 'Verify Your Identity'}
                </h2>
                
                {step === 'phone' ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Phone Number
                      </label>
                      <input
                        className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="+1 (000) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    
                    <button 
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        isLoading
                          ? 'bg-blue-300 text-white cursor-not-allowed'
                          : 'bg-blue-700 text-white hover:bg-blue-800'
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
                      <label className="block text-sm font-medium text-slate-700">
                        Verification Code
                      </label>
                      <input
                        className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-300"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        A verification code has been sent to {phone}
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <button 
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                          isLoading
                            ? 'bg-blue-300 text-white cursor-not-allowed'
                            : 'bg-blue-700 text-white hover:bg-blue-800'
                        }`}
                        onClick={handleVerifyOTP}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                      </button>
                      
                      <button
                        className="text-blue-700 text-sm hover:text-blue-800 transition-colors"
                        onClick={() => {
                          setStep('phone')
                          setError('')
                        }}
                      >
                        Change phone number
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === 'doctor' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Physician Portal Login
                </h2>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="doctor@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember-me" 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a onClick={handlePasswordReset} className="text-blue-700 hover:text-blue-800">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    isLoading
                      ? 'bg-blue-300 text-white cursor-not-allowed'
                      : 'bg-blue-700 text-white hover:bg-blue-800'
                  }`}
                  onClick={handleDoctorLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
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