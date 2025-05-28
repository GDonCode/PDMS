'use client'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Patient } from '@/app/types/patient';
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})

export default function PatientDashboard() {
  // Section Switcher
  const [activeSection, setActiveSection] = useState('overview')
  
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/patient');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch patient');

        setPatient(data.patient);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching patient:', err.message);
        }
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!patient) return;                         // safety

    const res  = await fetch('/api/update-patient', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(patient),           // now includes id
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update patient');
    alert('Patient updated successfully');
  };

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

      <main className={`${montserrat.className} bg-gray-200 min-h-screen min-full-screen p-3`}>
        <div className='flex flex-col gap-4 w-full'>

          
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
                  <h2 className='text-xl font-semibold'>Welcome, <span id="patientName">{patient?.first_name || 'User'}</span>.</h2>
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
                <div className='flex flex-col gap-3'>
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


              <div className='bg-white shadow-md rounded-lg p-4'>
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
              </div>


              {/* APPOINTMENTS LIST */} 
              <ul className='mt-6'>
                <li className='bg-white p-4 w-full rounded-lg shadow-md flex flex-col gap-2 md:flex-row justify-between md:items-center border-2 border-gray-200'>
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
                  <div className='flex w-full justify-between mt-2'>
                    <button className='flex items-center p-3 gap-2 bg-[#0070F0] text-white rounded-sm'>
                      <Image 
                        src="/bell.svg"
                        alt='Notification Bell Icon'
                        width={16}
                        height={16}
                      />
                      Remind Me
                    </button>
                    <button className='flex items-center gap-2 p-3 bg-[#0070F0] text-white rounded-sm'>
                      <Image 
                        src="/calendar-white.svg"
                        alt='Notification Bell Icon'
                        width={16}
                        height={16}
                      />
                      Reschedule
                    </button>
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
            <div>

              {/* TITLE AND SEARCH*/}
              <div className='bg-white shadow-md rounded-md p-4 w-full mb-6'>
                <div className='flex gap-3'>
                  <Image 
                      src="/logo.png"
                      alt="Logo"
                      width={30}
                      height={30}
                    />
                    <h2 className='text-xl font-semibold'>Your Medical Records</h2>
                </div>
                <div className='mt-4 mb-12'><label>Search</label><input type='text' className="border-2 border-gray-300"></input></div>

                {/* CLIPBOARD */} 
                <div className='flex flex-col mb-6'>
                  <h3 className='text-xl font-semibold'>Personal Information</h3>
                  <div className='min-h-1 bg-[#008044]'></div>
                </div>
                <div className='grid grid-cols-2 gap-12'>

                    {/* LEFT SIDE */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>First Name</label>
                        <input className="text-xl  font-semibold" type='text' value={patient?.first_name || ''} onChange={(e) => setPatient(prev => ({ ...prev!, first_name: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Date of Birth</label>
                        <input className="text-xl font-semibold w-[102%]" type='date' value={patient?.date_of_birth || ''} onChange={(e) => setPatient((prev: any) => ({ ...prev!, date_of_birth: e.target.value }))}/>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Sex</label>
                        <select className="text-xl font-semibold" value={patient?.sex || ''} onChange={(e) => setPatient(prev => ({ ...prev!, sex: e.target.value }))}>
                          <option value="">Select Sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Race</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.race || ''} onChange={(e) => setPatient(prev => ({ ...prev!, race: e.target.value }))}></input>
                      </div>
                    </div>
                  </div>


                  {/* RIGHT SIDE */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Last Name</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.last_name || ''} onChange={(e) => setPatient(prev => ({ ...prev!, last_name: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Age</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.age || ''} onChange={(e) => setPatient(prev => ({ ...prev!, age: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Offspring</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.offspring || ''} onChange={(e) => setPatient(prev => ({ ...prev!, offspring: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Nationality</label>
                        <select className="text-xl font-semibold" value={patient?.nationality || ''} onChange={(e) => setPatient(prev => ({ ...prev!, nationality: e.target.value }))}>
                          <option value="">Select Nationality</option>
                          <option value="Jamaican">Jamaican</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
                
                <div className='flex flex-col mb-6 mt-12'>
                  <h3 className='text-xl font-semibold'>Biometrics and Physical Data</h3>
                  <div className='min-h-1 bg-[#008044]'></div>
                </div>
                <div className='grid grid-cols-2 gap-12'>

                  {/* LEFT SIDE */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Height</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.height || ''} onChange={(e) => setPatient(prev => ({ ...prev!, height: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>B.M.I.</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.bmi || ''} onChange={(e) => setPatient(prev => ({ ...prev!, bmi: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Blood Type</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.blood_type || ''} onChange={(e) => setPatient(prev => ({ ...prev!, blood_type: e.target.value }))}></input>
                      </div>
                    </div>
                  </div>


                  {/* RIGHT SIDE */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                       <div className='flex flex-col'>
                        <label className='text-sm'>Weight</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.weight || ''} onChange={(e) => setPatient(prev => ({ ...prev!, weight: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Blood Pressure</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.blood_pressure || ''} onChange={(e) => setPatient(prev => ({ ...prev!, blood_pressure: e.target.value }))}></input>
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Resting heart Rate</label>
                        <input className="text-xl font-semibold" type='text' value={patient?.resting_heart_rate || ''} onChange={(e) => setPatient(prev => ({ ...prev!, resting_heart_rate: e.target.value }))}></input>
                      </div>
                    </div>
                  </div>
                </div>
                <button className='flex items-center p-3 gap-2 bg-[#008044] text-white rounded-sm mt-12'
                  onClick={handleSubmit}>Update Records
                </button>
              </div>
            </div>
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