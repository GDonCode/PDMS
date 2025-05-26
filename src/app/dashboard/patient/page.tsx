'use client'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useState } from 'react'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})
export default function PatientDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <header className={`${montserrat.className}`}>
        <div className="min-w-full h-16 bg-white shadow-lg flex items-center pl-4 gap-4">
          <Image 
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <div className='flex flex-col'>
            <h1 className="text-xl font-semibold text-slate-800">Patient Dashboard</h1>
            <p className='text-xs'>Monday, 26th. May, 2025</p>
          </div>
        </div>
      </header>

      <main className={`${montserrat.className} bg-gray-200 min-h-screen p-3`}>
        <div className='flex flex-col gap-4 p-2'>

          
          {/* Sidebar NAV*/}
          <div className='bg-white shadow-md rounded-lg p-4'>
            <nav>
              <ul className="gap-2 flex md:block">
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('overview')}>
                    <Image 
                      src="/grid.svg"
                      alt="Overview Icon"
                      width={24}
                      height={24}
                    />
                  <a href="#" className="block px-4 py-2 text-lg font-semibold"><span className="hidden md:block">Overview</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('appointments')}>
                  <Image 
                    src="/calendar.svg"
                    alt="Appointments Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="block px-4 py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Appointments</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('profile')}>
                  <Image 
                    src="/user.svg"
                    alt="Profile Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="block px-4 py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Profile</span></a>
                </li> 
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('medicalRecords')}>
                  <Image 
                    src="/folder-plus.svg"
                    alt="Mdeical Records Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="block px-4 py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Medical Records</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('messaging')}>
                  <Image 
                    src="/message-circle.svg"
                    alt="Message Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="block px-4 py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Messaging</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('settings')}>
                  <Image 
                    src="/settings.svg"
                    alt="Settings Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="block px-4 py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Settings</span></a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className='col-span-5'>

            {/* OVERVIEW SECTION */} 
            {activeSection === 'overview' && 
            <div className='flex flex-col gap-6'>
              <div className='bg-white shadow-md rounded-lg p-4'>
                <div className='flex w-fit items-center gap-3 mb-6'>
                  <Image 
                    src="/logo.png"
                    alt="Logo"
                    width={30}
                    height={30}
                  />
                  <h2 className='text-xl font-semibold'>Welcome, Patient</h2>
                </div>
                <div className='mb-6'>
                  <p className='font-[550]'>Upcoming Appointments</p>
                  <div>
                    no appointments scheduled
                  </div>
                </div>
                <div className='mb-6'>
                  <p className='font-[550]'>Prescription Reminders</p>
                  <div>
                    no prescriptions to take today
                  </div>
                </div>
              </div>

              {/* HEALTH TIP PLUS SCROLL CTA */}
              <div className='bg-white shadow-md rounded-lg p-4'>
                <div className='mb-6 flex flex-col gap-3'>
                  <div className='flex items-center gap-2 border-b-4 border-[#008044]'>
                    <Image 
                      src="/info.svg"
                      width={16}
                      height={16}
                      alt="Information Icon"
                    />
                    <p className='font-[550] text-lg'>Health Tip of the Day</p>
                  </div>
                  <div>
                    Remember to stay hydrated! Drink at least 8 glasses of water daily.
                  </div>
                </div>
              </div>

              {/* HEALTH TIP PLUS SCROLL CTA */}
              <div className='bg-white shadow-md rounded-lg p-4'>
                <p className='font-[550]'>Blog</p>
              </div>
            </div>
            }
            
            {/* APPOINTMENTS SECTION */}  
            {activeSection === 'appointments' && 
            <div>
              <div className='flex w-fit items-center gap-3 mb-6'>
                <Image 
                  src="/logo.png"
                  alt="Logo"
                  width={30}
                  height={30}
                />
                <h2 className='text-xl font-semibold'>Your Appointments</h2>
              </div>
              {/* APPOINTMENTS FILTERS */} 
              <div className='flex gap-6'>
                <button className='bg-emerald-200 rounded-lg px-3 text-sm'>All</button>
                <button className='bg-gray-200 rounded-lg px-3 text-sm'>Upcoming</button>
                <button className='bg-gray-200 rounded-lg px-3 text-sm'>Past</button>
              </div>

              {/* APPOINTMENTS LIST */} 
              <ul className='mt-6'>


                <li className='w-full rounded-lg p-5 shadow-md flex flex-col gap-2 md:flex-row justify-between md:items-center border-2 border-gray-200'>
                  <div>
                    <div className='flex items-center gap-6 mb-3 md:mb-0'>
                      <Image 
                        src="/clipboard.svg"
                        alt="Appointment Icon"
                        width={24}
                        height={24}
                      />
                      <div>
                        <p className='font-semibold'>General Checkup</p>
                        <p>Dr. Johnson</p>
                      </div>
                    </div>
                    <div className='flex md:ml-12 gap-6'>
                      <p className='text-sm w-fit mr-auto'>Thursday,<br/>25th Jan. 2025</p>
                      <p className='text-sm w-fit'>from 10:00 AM <br/>to 11:00 AM</p>
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <button className='bg-emerald-300 p-2 rounded-md font-semibold cursor-pointer md:px-4'>View Details</button>
                    <button className='bg-[#B3D4FC] p-2 rounded-md font-semibold cursor-pointer'>Reschedule</button>
                  </div>
                </li>


              </ul>
            </div>}

            {/* PROFILE SECTION */}
            {activeSection === 'profile' &&
              <div></div>
            }

            {/* MEDICAL RECORDS SECTION */}
            {activeSection === 'medicalRecords' && 
              <div></div>
            }

            {/* MESSAGING SECTION */}
            {activeSection === 'messaging' && 
              <div></div>
            }

            {/* SETTINGS SECTION */}
            {activeSection === 'settings' && 
              <div></div>
            }

          </div>


        </div>
      </main>
    </div>
  )
}