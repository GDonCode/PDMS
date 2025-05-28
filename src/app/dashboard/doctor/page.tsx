'use client'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import PatientMedicalForm from '@/app/components/patientMedicalForm';
import { Patient } from '@/app/types/patient';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})
export default function DoctorDashboard() {
  // Section Switcher
  const [activeSection, setActiveSection] = useState('overview')

  type Doctor = {
    first_name: string;
    last_name: string;
    email:string;
    license_number: string;
    available_hours: string;
    current_availability: string;
    current_medications: string;
    password: string;
  };
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/doctor');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch doctor');

        setDoctor(data.doctor);
      } catch (err) {
        console.error('Error fetching doctor:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllPatients = async () => {
      const res = await fetch('/api/get-all-patients');
      const json = await res.json();
      if (res.ok) {
        setPatients(json.patients);
      } else {
        console.error(json.error);
      }
    };
    fetchAllPatients();
  }, []);

  
  // Add this state to your component
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Function to toggle expansion
  const toggleExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
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
            <h1 className="text-xl font-semibold text-slate-800">Doctor Dashboard</h1>
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
                  onClick={() => setActiveSection('patientRecords')}>
                  <Image 
                    src="/folder-plus.svg"
                    alt="Medical Records Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="block px-4 py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Patient Records</span></a>
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
                  <h2 className='text-xl font-semibold'>Welcome, Dr. <span id="doctorName">{doctor?.last_name || 'User'}</span>.</h2>
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
                <div className='mb-12'>
                  <div className='flex w-fit items-center gap-3 mb-4'>
                    <Image 
                      src="/logo.png"
                      alt="Logo"
                      width={30}
                      height={30}
                    />
                    <h2 className='text-xl font-semibold'>Your Appointments</h2>
                  </div>
                  <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm'>Request New Appointment</button>
                </div>
                {/* APPOINTMENTS FILTERS */} 
                <div className='flex gap-6'>
                  <button className='bg-gray-200 rounded-lg px-3 text-sm'>All</button>
                  <button className='bg-gray-200 rounded-lg px-3 text-sm'>Upcoming</button>
                  <button className='bg-gray-200 rounded-lg px-3 text-sm'>Past</button>
                </div>
              


              {/* APPOINTMENTS LIST */} 
              <ul className='mt-4 flex flex-col gap-6'>
                <li className='bg-white p-4 w-full rounded-lg shadow-md flex flex-col gap-2 md:flex-row justify-between md:items-center border-2 border-gray-200'>
                  <div>
                    <div className='flex items-center gap-6 mb-3 md:mb-0' onClick={() => toggleExpansion('appointment-1')} style={{ cursor: 'pointer' }}>
                      <Image 
                        src="/clipboard.svg"
                        alt="Appointment Icon"
                        width={24}
                        height={24}
                      />
                      <div className='flex w-full'>
                        <div>
                          <p className='font-semibold'>General Checkup</p>
                          <p>Dr. Johnson</p>
                        </div>
                        <div className="ml-auto pr-2">
                          <Image 
                            src="/chevron-down.svg" 
                            alt="Expand Down Arrow" 
                            className={expandedItems['appointment-1'] ? "rotate-180" : ""} 
                            width={24} 
                            height={24} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex md:ml-12 gap-6'>
                      <p className='text-sm w-fit mr-auto'>Thursday,<br/>25th Jan. 2025</p>
                      <p className='text-sm w-fit'>from 10:00 AM <br/>to 11:00 AM</p>
                    </div>
                  </div>
                  {expandedItems['appointment-1'] && (
                    <div className='flex gap-3 mt-4'>
                      <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm'>View Details</button>
                      <button className='bg-gray-300 p-2 rounded-md font-semibold cursor-pointer text-[#008044] text-sm'>Reschedule</button>
                    </div>
                  )}
                </li>
                
                <li className='bg-white p-4 w-full rounded-lg shadow-md flex flex-col gap-2 md:flex-row justify-between md:items-center border-2 border-gray-200'>
                  <div>
                    <div className='flex items-center gap-6 mb-3 md:mb-0' onClick={() => toggleExpansion('appointment-2')} style={{ cursor: 'pointer' }}>
                      <Image 
                        src="/clipboard.svg"
                        alt="Appointment Icon"
                        width={24}
                        height={24}
                      />
                      <div className='flex w-full'>
                        <div>
                          <p className='font-semibold'>General Checkup</p>
                          <p>Dr. Johnson</p>
                        </div>
                        <div className="ml-auto pr-2">
                          <Image 
                            src="/chevron-down.svg" 
                            alt="Expand Down Arrow" 
                            className={expandedItems['appointment-2'] ? "rotate-180" : ""} 
                            width={24} 
                            height={24} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex md:ml-12 gap-6'>
                      <p className='text-sm w-fit mr-auto'>Thursday,<br/>25th Jan. 2025</p>
                      <p className='text-sm w-fit'>from 10:00 AM <br/>to 11:00 AM</p>
                    </div>
                  </div>
                  {expandedItems['appointment-2'] && (
                    <div className='flex gap-3 mt-4'>
                      <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm'>View Details</button>
                      <button className='bg-gray-300 p-2 rounded-md font-semibold cursor-pointer text-[#008044] text-sm'>Reschedule</button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
            </div>}

            {/* PROFILE SECTION */}
            {activeSection === 'profile' &&
              <div></div>
            }

            {/* PATIENT RECORDS SECTION */}
            {activeSection === 'patientRecords' && 
              <div className='bg-white shadow-md rounded-lg p-4'>
                <div className='flex gap-3'>
                  <Image 
                    src="/logo.png"
                    alt="Logo"
                    width={30}
                    height={30}
                  />
                  <h2 className='text-xl font-semibold'>Search Patient Records</h2>
                </div>
                <div className='mt-4 mb-12'><label>Search</label><input type='text' className="border-2 border-gray-300"></input></div>


                {selectedPatient ? (
                  <>
                    <PatientMedicalForm
                      patient={selectedPatient}
                      setPatient={setSelectedPatient}
                      handleSubmit={async () => {
                        if (!selectedPatient) return;
                        console.log(selectedPatient);

                        const res = await fetch('/api/update-patient', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(selectedPatient),
                        });

                        const data = await res.json();
                        if (!res.ok) {
                          throw new Error(data.error || 'Failed to update patient');
                        }

                        alert('Patient updated successfully');
                      }}
                    />

                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="mt-6 text-red-600 underline"
                    >
                      ← Back to patient list
                    </button>
                  </>
                ) : (
                  // Loop over patients
                  <>
                    {patients.map((patient) => (
                      <div
                        key={patient.user_id}
                        className="flex gap-3 mb-4 border cursor-pointer"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Image
                          src="/user.svg"
                          alt="User Icon"
                          width={24}
                          height={24}
                        />
                        <div className="flex-col">
                          <h2 className="font-semibold text-lg">
                            <span>{patient.first_name}</span> <span>{patient.last_name}</span>
                          </h2>
                          <p>
                            <span>{patient.sex}</span>, <span>{patient.age}</span> years old
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}



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