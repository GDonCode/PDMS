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

export default function DoctorDashboard() {
  const [activeSection, setActiveSection] = useState<'overview' | 'appointments' | 'patients' | 'profile' | 'settings'>('overview')
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [patients, setPatients] = useState<any[]>([]);

  const router = useRouter()

  // 🔐 Load session and listen to auth changes
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

      if (!session?.user?.email) {
        setShowToast(true)
      } else {
        setShowToast(false)
      }
    }

    getCurrentSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) console.error('Error fetching patients:', error);
      else setPatients(data);
    };

    fetchPatients();
  }, []);

  // 🚪 Sign out logic
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      router.push('/login')
    }
  }

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

      <header className="bg-[#4e944a] shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Omega Medical Logo" width={40} height={40} className="mr-3" />
              <h1 className="text-xl font-semibold text-white">Omega Medical</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                </div>
                <span className="text-sm font-medium text-white">Doctor</span>
              </div>
              <div className="relative">
                <button className="p-2 rounded-full text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-2 max-h-fit">
            <div className="bg-[#4e944a] shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-medium text-white">Dashboard</h2>
              </div>
              <nav className="p-2">
                <button 
                    onClick={() => setActiveSection('overview')}
                  className={`cursor-pointer w-full text-left text-lg px-4 py-2 rounded-md mb-1 flex items-center text-white ${activeSection === 'overview' ? 'bg-[#2d50a0]' : 'hover:scale-105'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Overview
                </button>
                <button 
                    onClick={() => setActiveSection('appointments')}
                    className={`cursor-pointer w-full text-left text-lg px-4 py-2 rounded-md mb-1 flex items-center text-white ${activeSection === 'appointments' ? 'bg-[#2d50a0]' : 'hover:scale-105'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Appointments
                </button>
                <button 
                    onClick={() => setActiveSection('patients')}
                  className={`cursor-pointer w-full text-left text-lg px-4 py-2 rounded-md mb-1 flex items-center text-white ${activeSection === 'patients' ? 'bg-[#2d50a0]' : 'hover:scale-105'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Patients
                </button>
                <button 
                    onClick={() => setActiveSection('settings')}
                    className={`cursor-pointer w-full text-left text-xl px-4 py-2 rounded-md mb-1 flex items-center text-white ${activeSection === 'settings' ? 'bg-[#2d50a0]' : 'hover:scale-105'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </nav>
              <div className="p-4 border-t border-slate-200">
                <button className="cursor-pointer w-full text-lg flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                onClick={handleSignOut}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-5">

            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Box */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">
                      Welcome, <span>Dr. Smith</span>.
                    </h2>
                    <p className="text-slate-600">Specialty: Cardiology</p>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-slate-800 mb-4">Upcoming Appointments</h3>
                    <ul className="space-y-4">
                      {[1, 2, 3].map((appointment) => (
                        <li
                          key={appointment}
                          className="flex justify-between items-center p-4 border rounded-md hover:bg-slate-50"
                        >
                          <div>
                            <p className="text-slate-800 font-medium">John Doe</p>
                            <p className="text-slate-500 text-sm">09:30 AM — General Checkup</p>
                          </div>
                          <button className="text-blue-600 text-sm hover:underline">View Details</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-slate-800 mb-4">Pending Actions</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                        <div>
                          <p className="text-slate-800 font-medium">3 Unreviewed Lab Results</p>
                          <p className="text-slate-500 text-sm">Last updated 1 hour ago</p>
                        </div>
                        <button className="text-blue-600 text-sm hover:underline">Review Now</button>
                      </li>
                      <li className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                        <div>
                          <p className="text-slate-800 font-medium">2 Prescription Requests</p>
                          <p className="text-slate-500 text-sm">New since this morning</p>
                        </div>
                        <button className="text-blue-600 text-sm hover:underline">Approve</button>
                      </li>
                      <li className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                        <div>
                          <p className="text-slate-800 font-medium">1 New Message from Patient</p>
                          <p className="text-slate-500 text-sm">John Doe messaged 20 mins ago</p>
                        </div>
                        <button className="text-blue-600 text-sm hover:underline">Reply</button>
                      </li>
                    </ul>
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

            {activeSection === 'patients' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-slate-800">Patients Database</h2>
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
                    <div className='grid grid-cols-1 bg-blue-50 shadow-sm rounded-md'>
                      {patients.map((patient, i) => (
                        <div key={i} className="p-6 bg-transparent border-b border-slate-200 hover:bg-emerald-100">
                          <div className='grid grid-cols-2 transition-transform duration-200 hover:scale-102'>
                            <div>
                              <h3 className="text-xl font-semibold  hover:cursor-pointer w-fit">{patient.first_name} {patient.last_name}</h3>
                              <p className="text-md text-slate-600 font-medium">{patient.gender}, {patient.age}</p>
                              <p className="text-md text-slate-600 font-medium">{patient.phone}</p>
                            </div>
                            <div className='flex justify-end items-center gap-6'>
                              <div className='bg-white rounded-full p-2'>
                                <Image src="/eye.svg" alt="view records" width={25} height={30} className="cursor-pointer hover:scale-105" />
                              </div>
                              <div className='bg-white rounded-full p-2'>
                                <Image src="/message-square.svg" alt="message patient" width={25} height={30} className="cursor-pointer hover:scale-105" />
                              </div>
                              <div className='bg-white rounded-full p-2'>
                                <Image src="/share.svg" alt="share records" width={25} height={30} className="cursor-pointer hover:scale-105" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

