'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import supabase from '@/app/lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-montserrat'
})

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const getCurrentSession = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error)
        return
      }

      setSession(session)
      setUser(session?.user || null)

      if (!session?.user.email) {
        setShowToast(true)
      }
      else {
        setShowToast(false)
      }
    }

    // Set current session on load
    getCurrentSession()

    // Listen for auth state changes (signup, login)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const welcomeName = document.getElementById('welcomeName')
  const accountName = document.getElementById('accountName') 
  const dobOverview = document.getElementById('dobOverview')
  const genOverview = document.getElementById('genOverview')
  const heightOverview = document.getElementById('heightOverview')
  const weightOverview = document.getElementById('weightOverview')
  useEffect(() => {
    const loadPatientProfile = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.log(error)
        return
      }

      if (data) {
        setemailValue(session?.user?.email || '')
        setfNameValue(data.first_name || '')
        //welcome Message
        if (welcomeName) {
          welcomeName.innerHTML = data.first_name || ''
        }
        if (accountName) {
          accountName.innerHTML = data.first_name || ''
        }
        if (dobOverview) {
          dobOverview.innerHTML = data.date_of_birth || ''
        }
        if (genOverview) {
          genOverview.innerHTML = data.gender || ''
        }
        setlNameValue(data.last_name || '')
        setdobValue(data.date_of_birth || '')
        setgenderValue(data.gender || '')
        setaddressValue(data.address || '')
        setemergencyNameValue(data.emergency_name || '')
        setemergencyRelValue(data.emergency_relation || '')
        setemergencyPhoneValue(data.emergency_phone || '')
        setmedConditionsValue(data.medical_conditions || '')
        setallergiesValue(data.allergies || '')
        setcurrentmedsValue(data.current_medications || '')
        setsurgeriesValue(data.surgeries || '')
        setinsuranceProviderValue(data.insurance_provider || '')
        setinsurancePolNumValue(data.insurance_policy_number || '')
        setinsuranceGrpNumValue(data.insurance_group_number || '')
        setdrinkingValue(data.drinking_frequency || '')
        setsmokingValue(data.smoking_frequency || '')
        setexerciseValue(data.exercise_frequency || '')
        setdietRestrictionValue(data.diet_restrictions || '')
        setfamHistoryValue(data.family_history || '')
      }
    }

    loadPatientProfile()
  }, [user])


  const router = useRouter()
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      // Optional: route to login after successful sign-out
      router.push('/login')
    }
  }

  const [emailValue, setemailValue] = useState('');
  const [fNameValue, setfNameValue] = useState('');
  const [lNameValue, setlNameValue] = useState('');
  const [dobValue, setdobValue] = useState('');
  const [genderValue, setgenderValue] = useState('');
  const [addressValue, setaddressValue] = useState('');
  const [emergencyNameValue, setemergencyNameValue] = useState('');
  const [emergencyRelValue, setemergencyRelValue] = useState('');
  const [emergencyPhoneValue, setemergencyPhoneValue] = useState('');
  const [medConditionsValue, setmedConditionsValue] = useState('');
  const [allergiesValue, setallergiesValue] = useState('');
  const [currentmedsValue, setcurrentmedsValue] = useState('');
  const [surgeriesValue, setsurgeriesValue] = useState('');
  const [insuranceProviderValue, setinsuranceProviderValue] = useState('');
  const [insurancePolNumValue, setinsurancePolNumValue] = useState('');
  const [insuranceGrpNumValue, setinsuranceGrpNumValue] = useState('');
  const [drinkingValue, setdrinkingValue] = useState('');
  const [smokingValue, setsmokingValue] = useState('');
  const [exerciseValue, setexerciseValue] = useState('');
  const [dietRestrictionValue, setdietRestrictionValue] = useState('');
  const [famHistoryValue, setfamHistoryValue] = useState('');

  const MovetoDB = async () => {

    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    const { data: PatientProfileData, error: PatientProfileError } = await supabase
      .from('patients')
      .upsert([{
        first_name: fNameValue || null,
        last_name: lNameValue || null,
        date_of_birth: dobValue || null,
        gender: genderValue || null,
        address: addressValue || null,
        emergency_name: emergencyNameValue || null,
        emergency_relation: emergencyRelValue || null,
        emergency_phone: emergencyPhoneValue || null,
        medical_conditions: medConditionsValue || null,
        allergies: allergiesValue || null,
        current_medications: currentmedsValue || null,
        surgeries: surgeriesValue || null,
        insurance_provider: insuranceProviderValue || null,
        insurance_policy_number: insurancePolNumValue || null,
        insurance_group_number: insuranceGrpNumValue || null,
        drinking_frequency: drinkingValue || null,
        smoking_frequency: smokingValue || null,
        exercise_frequency: exerciseValue || null,
        diet_restrictions: dietRestrictionValue || null,
        family_history: famHistoryValue || null
      }])
      if (PatientProfileError) {
      console.error('Error inserting data:', PatientProfileError);
      } else {
        alert('Profile Data Updated');
      }
      
      const { error: emailUpdateError } = await supabase.auth.updateUser({
          email: emailValue || undefined
        })

        if (emailUpdateError) {
          console.error('❌ Error updating auth.users email:', emailUpdateError)
        } else {
          alert('Email Data updated')
        }
      };



  const [activeSection, setActiveSection] = useState<
    'overview' | 'appointments' | 'prescriptions' | 'reports' | 'profile' | 'settings'
  >('overview');

  return (
    <div className={`${montserrat.className} min-h-screen bg-slate-50`}>
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-4 w-80 animate-slideIn">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Complete Your Health Profile</h3>
                <p className="text-sm text-slate-500">
                  Please add your medical history and personal details to help doctors provide better care.
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600"
              onClick={() => setShowToast(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setActiveSection('profile')}
            className="mt-3 w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            Complete Now
          </button>
        </div>
      )}

      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Omega Medical Logo" width={40} height={40} className="mr-3" />
              <h1 className="text-xl font-semibold text-slate-800">Omega Medical</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                </div>
                <span id="accountName" className="text-sm font-medium text-slate-700"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="bg-white shadow rounded-lg overflow-hidden max-h-fit md:col-span-2">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-medium text-slate-800">Patient Portal</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md mb-1 flex items-center ${activeSection === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Overview
              </button>
              <button
                onClick={() => setActiveSection('appointments')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md mb-1 flex items-center ${activeSection === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointments
              </button>
              <button
                onClick={() => setActiveSection('prescriptions')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md mb-1 flex items-center ${activeSection === 'prescriptions' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Prescriptions
              </button>
              <button
                onClick={() => setActiveSection('reports')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md mb-1 flex items-center ${activeSection === 'reports' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Medical Reports
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md mb-1 flex items-center ${activeSection === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md mb-1 flex items-center ${activeSection === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </nav>
            <div className="p-4 border-t border-slate-200">
              <button className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                onClick={handleSignOut}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Welcome, <span id="welcomeName"></span>.</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mb-6'>
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-col'>
                          <p className="text-slate-600">Date of Birth</p><span id="dobOverview"></span>
                        </div>
                        <div className='flex flex-col'>
                          <p className="text-slate-600">Gender:</p><span id="genOverview"></span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-col'>
                          <p className="text-slate-600">Height</p><span id="heightOverview"></span>
                        </div>
                        <div className='flex flex-col'>
                          <p className="text-slate-600">Weight</p><span id="weightOverview"></span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50  rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.79-3 4s1.343 4 3 4 3-1.79 3-4-1.343-4-3-4zm0 12c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.48 0 2.865.403 4.034 1.102a.998.998 0 01.15 1.55l-2.017 2.018A5.978 5.978 0 0012 8c-3.314 0-6 2.686-6 6s2.686 6 6 6z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Heart Rate</h3>
                            <p id="BPM" className="text-2xl font-semibold text-slate-800"></p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50  rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0-4h.01M12 20h.01M16 12a4 4 0 00-8 0v4a4 4 0 008 0v-4z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Blood Pressure</h3>
                            <p className="text-2xl font-semibold text-slate-800"></p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50  rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">BMI</h3>
                            <p className="text-2xl font-semibold text-slate-800"></p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50  rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Blood Glucose Level (mg/dL or mmol/L)</h3>
                            <p className="text-2xl font-semibold text-slate-800"></p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50  rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Oxygen Saturation (SpO₂ %) </h3>
                            <p className="text-2xl font-semibold text-slate-800"></p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50  rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Cholesterol Level (Total/LDL/HDL)</h3>
                            <p className="text-2xl font-semibold text-slate-800"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Additional Biometrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                      <div className="p-4 border border-slate-200 rounded-lg">Respiration Rate: <span className="font-semibold"> breaths/min</span></div>
                      <div className="p-4 border border-slate-200 rounded-lg">Height: <span className="font-semibold"></span></div>
                      <div className="p-4 border border-slate-200 rounded-lg">Body Temperature: <span className="font-semibold"> °F</span></div>
                      <div className="p-4 border border-slate-200 rounded-lg">Weight: <span className="font-semibold"> kg</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appointments' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-slate-800">My Appointments</h2>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Schedule New Appointment
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-700">
                          You can schedule appointments with specialists directly through the portal or call our reception at (555) 123-4567.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex space-x-2 mb-4">
                        <button className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                          All
                        </button>
                        <button className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 hover:bg-slate-100">
                          Upcoming
                        </button>
                        <button className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 hover:bg-slate-100">
                          Past
                        </button>
                        <button className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 hover:bg-slate-100">
                          Cancelled
                        </button>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            )}

            {activeSection === 'prescriptions' && (
              <p>Placeholder text</p>
            )}

            {activeSection === 'reports' && (
              <p>Placeholder text</p>
            )}


            {activeSection === 'profile' && (
              <div className="space-y-6 text-black">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">My Health Profile</h2>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-700">
                          Completing your health profile helps your doctors provide better care. All information is kept confidential and secure.
                        </p>
                      </div>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                              Email
                            </label>
                            <input
                              type="text"
                              id="email"
                              name="email"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={emailValue}
                              onChange={(e) => setemailValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={fNameValue}
                              onChange={(e) => setfNameValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={lNameValue}
                              onChange={(e) => setlNameValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              id="dateOfBirth"
                              name="dateOfBirth"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={dobValue}
                              onChange={(e) => setdobValue(e.target.value)}
                              placeholder="mm/dd/yyyy"
                            />
                          </div>
                          <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                              Gender
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={genderValue}
                              onChange={(e) => setgenderValue(e.target.value)}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                              Address
                            </label>
                            <textarea
                              id="address"
                              name="address"
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={addressValue}
                              onChange={(e) => setaddressValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="emergencyName" className="block text-sm font-medium text-slate-700 mb-1">
                              Contact Name
                            </label>
                            <input
                              type="text"
                              id="emergencyName"
                              name="emergencyName"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={emergencyNameValue}
                              onChange={(e) => setemergencyNameValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-slate-700 mb-1">
                              Relationship
                            </label>
                            <input
                              type="text"
                              id="emergencyRelationship"
                              name="emergencyRelationship"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={emergencyRelValue}
                              onChange={(e) => setemergencyRelValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-slate-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="emergencyPhone"
                              name="emergencyPhone"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={emergencyPhoneValue}
                              onChange={(e) => setemergencyPhoneValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Medical History</h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="conditions" className="block text-sm font-medium text-slate-700 mb-1">
                              Medical Conditions
                            </label>
                            <textarea
                              id="conditions"
                              name="conditions"
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="List any chronic conditions, diseases, or medical problems"
                              value={medConditionsValue}
                              onChange={(e) => setmedConditionsValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 mb-1">
                              Allergies
                            </label>
                            <textarea
                              id="allergies"
                              name="allergies"
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="List any allergies to medications, foods, or other substances"
                              value={allergiesValue}
                              onChange={(e) => setallergiesValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="medications" className="block text-sm font-medium text-slate-700 mb-1">
                              Current Medications
                            </label>
                            <textarea
                              id="medications"
                              name="medications"
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="List all medications you are currently taking"
                              value={currentmedsValue}
                              onChange={(e) => setcurrentmedsValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="surgeries" className="block text-sm font-medium text-slate-700 mb-1">
                              Past Surgeries/Hospitalizations
                            </label>
                            <textarea
                              id="surgeries"
                              name="surgeries"
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="List any surgeries or hospital stays with approximate dates"
                              value={surgeriesValue}
                              onChange={(e) => setsurgeriesValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Insurance Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="insuranceProvider" className="block text-sm font-medium text-slate-700 mb-1">
                              Insurance Provider
                            </label>
                            <input
                              type="text"
                              id="insuranceProvider"
                              name="insuranceProvider"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={insuranceProviderValue}
                              onChange={(e) => setinsuranceProviderValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="policyNumber" className="block text-sm font-medium text-slate-700 mb-1">
                              Policy Number
                            </label>
                            <input
                              type="text"
                              id="policyNumber"
                              name="policyNumber"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={insurancePolNumValue}
                              onChange={(e) => setinsurancePolNumValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="groupNumber" className="block text-sm font-medium text-slate-700 mb-1">
                              Group Number
                            </label>
                            <input
                              type="text"
                              id="groupNumber"
                              name="groupNumber"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={insuranceGrpNumValue}
                              onChange={(e) => setinsuranceGrpNumValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Lifestyle Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="smokingFrequency" className="block text-sm font-medium text-slate-700 mb-1">
                              Smoking Frequency
                            </label>
                            <select
                              id="smokingFrequency"
                              name="smokingFrequency"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={smokingValue}
                              onChange={(e) => setsmokingValue(e.target.value)}
                            >
                              <option value="">Select Frequency</option>
                              <option value="none">None</option>
                              <option value="occasional">Occasional</option>
                              <option value="moderate">Moderate</option>
                              <option value="heavy">Heavy</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="alcoholFrequency" className="block text-sm font-medium text-slate-700 mb-1">
                              Alcohol Frequency
                            </label>
                            <select
                              id="alcoholFrequency"
                              name="alcoholFrequency"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={drinkingValue}
                              onChange={(e) => setdrinkingValue(e.target.value)}
                            >
                              <option value="">Select Frequency</option>
                              <option value="none">None</option>
                              <option value="occasional">Occasional</option>
                              <option value="moderate">Moderate</option>
                              <option value="heavy">Heavy</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="exerciseFrequency" className="block text-sm font-medium text-slate-700 mb-1">
                              Exercise Frequency
                            </label>
                            <select
                              id="exerciseFrequency"
                              name="exerciseFrequency"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={exerciseValue}
                              onChange={(e) => setexerciseValue(e.target.value)}
                            >
                              <option value="">Select Frequency</option>
                              <option value="sedentary">Sedentary</option>
                              <option value="light">Light (1-2 days/week)</option>
                              <option value="moderate">Moderate (3-4 days/week)</option>
                              <option value="active">Active (5+ days/week)</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-slate-700 mb-1">
                              Dietary Restrictions
                            </label>
                            <input
                              type="text"
                              id="dietaryRestrictions"
                              name="dietaryRestrictions"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="E.g., vegetarian, gluten-free, etc."
                              value={dietRestrictionValue}
                              onChange={(e) => setdietRestrictionValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Family Medical History</h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="familyHistory" className="block text-sm font-medium text-slate-700 mb-1">
                              Significant Family Medical Conditions
                            </label>
                            <textarea
                              id="familyHistory"
                              name="familyHistory"
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="List any significant medical conditions in your immediate family (parents, siblings, children)"
                              value={famHistoryValue}
                              onChange={(e) => setfamHistoryValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={MovetoDB}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}


            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Account Settings</h2>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-slate-700">
                          Manage your account preferences, notifications, and security settings. Changes made here will take effect immediately.
                        </p>
                      </div>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                              Username
                            </label>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="preferredLanguage" className="block text-sm font-medium text-slate-700 mb-1">
                              Preferred Language
                            </label>
                            <select
                              id="preferredLanguage"
                              name="preferredLanguage"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="zh">Chinese</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 mb-1">
                              Time Zone
                            </label>
                            <select
                              id="timezone"
                              name="timezone"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="UTC">UTC (Coordinated Universal Time)</option>
                              <option value="EST">EST (Eastern Standard Time)</option>
                              <option value="CST">CST (Central Standard Time)</option>
                              <option value="MST">MST (Mountain Standard Time)</option>
                              <option value="PST">PST (Pacific Standard Time)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="md:col-span-2 border-t pt-4">
                            <p className="text-sm text-slate-500 mb-4">Leave the fields below empty if you don't want to change your password</p>
                          </div>
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Notification Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="emailAppointments"
                                name="emailAppointments"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailAppointments" className="font-medium text-slate-700">
                                Appointment Reminders
                              </label>
                              <p className="text-slate-500">Receive email notifications about upcoming appointments</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="emailPrescriptions"
                                name="emailPrescriptions"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailPrescriptions" className="font-medium text-slate-700">
                                Prescription Updates
                              </label>
                              <p className="text-slate-500">Receive email notifications when prescriptions are ready</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="textAppointments"
                                name="textAppointments"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="textAppointments" className="font-medium text-slate-700">
                                SMS Appointment Reminders
                              </label>
                              <p className="text-slate-500">Receive text message reminders about upcoming appointments</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="marketingEmails"
                                name="marketingEmails"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="marketingEmails" className="font-medium text-slate-700">
                                Health Tips & Updates
                              </label>
                              <p className="text-slate-500">Receive occasional emails about health tips and clinic updates</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Two-Factor Authentication</h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-slate-800">Two-Factor Authentication</h4>
                              <p className="text-sm text-slate-600 mt-1">
                                Add an extra layer of security to your account by requiring a verification code in addition to your password.
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className={`mr-3 text-sm text-slate-500`}>
                              </span>
                              <button
                                type="button"
                                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                <span className="sr-only">Enable two-factor authentication</span>
                                <span
                                  className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h4 className="font-medium text-slate-800">Recovery Options</h4>
                          <p className="text-sm text-slate-600 mt-1 mb-3">
                            Set up recovery methods in case you lose access to your device or authentication app.
                          </p>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label htmlFor="recoveryEmail" className="block text-sm font-medium text-slate-700 mb-1">
                                Recovery Email
                              </label>
                              <input
                                type="email"
                                id="recoveryEmail"
                                name="recoveryEmail"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="backup-email@example.com"
                              />
                            </div>
                            <div>
                              <label htmlFor="recoveryPhone" className="block text-sm font-medium text-slate-700 mb-1">
                                Recovery Phone Number
                              </label>
                              <input
                                type="tel"
                                id="recoveryPhone"
                                name="recoveryPhone"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Privacy Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="shareDataForResearch"
                                name="shareDataForResearch"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="shareDataForResearch" className="font-medium text-slate-700">
                                Anonymous Data Sharing for Research
                              </label>
                              <p className="text-slate-500">Allow anonymized medical data to be used for healthcare research</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="showProfileToProviders"
                                name="showProfileToProviders"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="showProfileToProviders" className="font-medium text-slate-700">
                                Allow Profile Access to Healthcare Network
                              </label>
                              <p className="text-slate-500">Allow healthcare providers within our network to view your profile</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Account Actions</h3>
                        <div className="space-y-4">
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Download My Medical Records
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Deactivate Account
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          className="px-4 py-2 mr-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">© 2025 Omega Medical. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
