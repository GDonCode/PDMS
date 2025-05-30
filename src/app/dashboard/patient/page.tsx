'use client'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Patient } from '@/app/types/patient';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import supabase from '@/app/lib/supabaseClient';
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})

export default function PatientDashboard() {
  const router = useRouter();
  // Section Switcher
  const [activeSection, setActiveSection] = useState('overview')
  
  const [patient, setPatient] = useState<Patient | null>(null);
  type Appointment = {
    id: string;
    appointment_title: string;
    patient_name: string;
    doctor_name: string;
    appointment_date: string;
    appointment_time: string;
    created_at: string;
    appointment_status: string;
  }
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const pullAppointments = async() => {
      if (!patient) return;
      const fullName = `${patient.first_name} ${patient.last_name}`;
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_name', fullName)

      if (error) {
        console.error('Error fetching appointments:', error);
      } 
      else {
        setAppointments(appointments);
      }
    };
  useEffect(() => {
    pullAppointments();
  }, [patient])
  if (activeSection === 'appointments'){
    pullAppointments();
  }
  if (activeSection == 'medicalRecords'){

  }

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
    if (!patient) return;                      

    const res  = await fetch('/api/update-patient', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(patient),           
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update patient');
    alert('Patient updated successfully');
  };

  const prepNewAppt = async () => {
    if (!patient) return;
  
    const fullName = `${patient.first_name} ${patient.last_name}`;
    Cookies.set('patientName', fullName, { path: '/' });
  
    router.push('/PATIENTcreateAPPT');
  }

  // Function to toggle expansion
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const toggleExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  //DELETE APPOINTMENTS ------- DELETE APPOINTMENTS -------- DELETE APPOINTMENTS -------- DELETE APPOINTMENTS -------- DELETE APPOINTMENTS -------- DELETE APPOINTMENTS -------- DELETE APPOINTMENTS
  const ApptDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this appointment?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting appointment:", error.message);
      alert("Failed to delete appointment. Please try again.");
      return;
    }

    pullAppointments();
  };
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const handleUpdate = async (id: string) => {
    // call your backend function here if needed
    try {
      await updateAppointment(id, rescheduleDate, rescheduleTime); // replace with actual API/db update call

      // Optionally refresh data or update local state if applicable
      // Then reset reschedule state
      setReschedulingId(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };
  const updateAppointment = async (id:string, date:string, time:string) => {
    const { error } = await supabase
      .from('appointments')
      .update({
        appointment_date: date,
        appointment_time: time,
        appointment_status: "pending",
      })
      .eq('id', id);

    if (error) {
      throw error;
    }
  };
//DELETE ACCOUNT --------- DELETE ACCOUNT --------- DELETE ACCOUNT --------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT 
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (!confirmed) return;

    setLoading(true);
    try {
      if (patient) {
        const userId = patient.user_id;

        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) {
          console.error("Failed to delete user:", error);
          alert("Failed to delete your account.");
        } else {
          console.log("Account deleted successfully.");
          alert("Your account has been deleted.");
          window.location.href = '/register';
        }
      } else {
        console.log("Unauthorized");
        alert("You are not authorized to perform this action.");
      }
    } catch (err) {
      console.error("Delete Account Error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

//------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);

  const handleSave = async () => {
    if (!editedPatient || !editedPatient.first_name || !editedPatient.last_name) {
      alert('First Name and Last Name are required.');
      return;
    }

    // Send update to Supabase
    const { error } = await supabase
      .from('patients')
      .update(editedPatient)
      .eq('user_id', patient?.user_id);

    if (error) {
      console.error('Error saving patient:', error.message);
      alert('Failed to save patient record.');
      return;
    }

    // Update local state and exit edit mode
    setPatient(editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  const tips = [
    "Remember to stay hydrated! Drink at least 8 glasses of water daily.",
    "Get at least 7–9 hours of sleep every night for optimal health.",
    "Take a short walk every hour to improve circulation and posture.",
    "Eat a variety of fruits and vegetables to boost your immune system.",
    "Take deep breaths regularly to reduce stress and increase focus."
  ];

  const [selectedTip, setSelectedTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);


  const [upcoming, setUpcoming] = useState<Appointment[]>([]);

  useEffect(() => {
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(now.getDate() + 7);

  const filtered = appointments.filter((appt) => {
    const apptDate = new Date(`${appt.appointment_date}T00:00:00`);
    return (
      apptDate >= now &&
      apptDate <= oneWeekFromNow &&
      appt.appointment_status === 'confirmed'
    );
  });

  setUpcoming(filtered);
}, [appointments]);
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

      <main className={`${montserrat.className} gradient-background min-h-screen min-full-screen p-3`}>
        <div className='flex flex-col gap-4 w-full'>

          
          {/* Sidebar NAV*/}
          <div className='bg-white shadow-md rounded-lg p-4'>
            <nav>
              <ul className="gap-2 flex justify-center gap-12 md:justify-center md:gap-4">
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('overview')}>
                    <Image 
                      src="/grid.svg"
                      alt="Overview Icon"
                      width={24}
                      height={24}
                    />
                  <a href="#" className="md:block md:px-4 md:py-2 text-lg font-semibold"><span className="hidden md:block">Overview</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('appointments')}>
                  <Image 
                    src="/calendar.svg"
                    alt="Appointments Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="md:block md:px-4 md:py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Appointments</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('medicalRecords')}>
                  <Image 
                    src="/folder-plus.svg"
                    alt="Mdeical Records Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="md:block md:px-4 md:py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Medical Records</span></a>
                </li>
                <li className='flex items-center hover:bg-emerald-100 hover:shadow-md p-2 rounded-md cursor-pointer'
                  onClick={() => setActiveSection('profile')}>
                  <Image 
                    src="/user.svg"
                    alt="Profile Icon"
                    width={24}
                    height={24}
                  />
                  <a href="#" className="md:block md:px-4 md:py-2 rounded-md text-lg font-semibold"><span className="hidden md:block">Profile</span></a>
                </li> 
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className='col-span-5'>

            {/* OVERVIEW SECTION */} 
            {activeSection === 'overview' && 
            <div className='flex flex-col gap-6'>
              <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
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
                    {upcoming.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {upcoming.map(appt => (
                          <li key={appt.id} className="text-sm border p-2 rounded-md">
                            <strong>{appt.appointment_title}</strong> with {appt.patient_name} on{" "}
                            {new Date(appt.appointment_date + "T00:00:00").toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric'
                            })} at {appt.appointment_time.slice(0, 5)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">no appointments scheduled</p>
                    )}
                  </div>
                </div>
              </div>

              {/* HEALTH TIP PLUS SCROLL CTA */}
              <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
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
                    {selectedTip}
                  </div>
                </div>
              </div>
            </div>
            }
            
            {/* APPOINTMENTS SECTION */}  
            {activeSection === 'appointments' && 
              <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
                <div className='mb-12'>
                  <div className='flex w-fit items-center gap-3 mb-6'>
                    <Image 
                      src="/logo.png"
                      alt="Logo"
                      width={30}
                      height={30}
                    />
                    <h2 className='text-xl font-semibold'>Your Appointments</h2>
                  </div>
                  <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm' onClick={prepNewAppt}>Request New Appointment</button>
                </div>
                {/* APPOINTMENTS FILTERS */} 
                <div className='flex gap-6'>
                  <button className='bg-gray-200 rounded-lg px-3 text-sm'>All</button>
                  <button className='bg-gray-200 rounded-lg px-3 text-sm'>Upcoming</button>
                  <button className='bg-gray-200 rounded-lg px-3 text-sm'>Past</button>
                </div>
              


              {/* APPOINTMENTS LIST */} 
              <ul className='mt-4 flex flex-col gap-6'>
                {appointments.map((appointment) => (
                                  <li
                                    key={appointment.id}
                                    className='bg-white p-4 w-full rounded-lg shadow-md flex flex-col gap-2 md:flex-row justify-between md:items-center border-2 border-gray-200'
                                  >
                                    <div>
                                      <div
                                        className='flex items-center gap-6 mb-3 md:mb-0'
                                        onClick={() => toggleExpansion(appointment.id)}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <Image 
                                          src="/clipboard.svg"
                                          alt="Appointment Icon"
                                          width={24}
                                          height={24}
                                        />
                                        <div className='flex w-full'>
                                          <div>
                                            <p className='font-semibold'>{appointment.appointment_title}</p>
                                            <p>Dr. {appointment.doctor_name}</p>
                                          </div>
                                          <div className="ml-auto pr-2">
                                            <Image 
                                              src="/chevron-down.svg" 
                                              alt="Expand Down Arrow" 
                                              className={`${expandedItems[appointment.id] ? "rotate-180" : ""} md:hidden`} 
                                              width={24} 
                                              height={24} 
                                            />
                                          </div>
                                        </div>
                                      </div>
                
                                      <div className='flex md:ml-12 gap-1 md:flex-col'>
                                        <div className='flex gap-1'>
                                          <p className='text-sm w-fit'>
                                            {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                          </p>
                                          <p className='text-sm w-fit'>
                                            at {appointment.appointment_time.slice(0, 5)}
                                          </p>
                                        </div>
                                        <div>
                                          <div className='ml-auto md:ml-0 flex flex-col'>
                                            {appointment.appointment_status === 'pending' && (
                                              <p className="ml-auto md:ml-0 md:mt-4 flex items-center gap-2 text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert blinking-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                                pending...
                                              </p>
                                            )}
                                            {appointment.appointment_status === 'confirmed' && (
                                              <p className="ml-auto md:ml-0 md:mt-4 flex items-center gap-2 text-green-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
                                                confirmed.
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                
                                    <div className={`flex gap-3 mt-4 ${expandedItems[appointment.id] ? '' : 'hidden'} md:flex`}>
                                      <div className='flex gap-3 mt-4'>
                                        {reschedulingId === appointment.id ? (
                                          <>
                                            <input
                                              type="date"
                                              value={rescheduleDate}
                                              onChange={(e) => setRescheduleDate(e.target.value)}
                                              className='border p-2 rounded-md text-sm'
                                            />
                                            <input
                                              type="time"
                                              value={rescheduleTime}
                                              onChange={(e) => setRescheduleTime(e.target.value)}
                                              className='border p-2 rounded-md text-sm'
                                            />
                                            <button
                                              className='bg-[#3ca444] text-white p-2 rounded-md font-semibold text-sm'
                                              onClick={() => handleUpdate(appointment.id)}
                                            >
                                              Update
                                            </button>
                                            <button
                                              className='bg-gray-300 text-black p-2 rounded-md font-semibold text-sm'
                                              onClick={() => setReschedulingId(null)}
                                            >
                                              Close
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              className='bg-gray-300 p-2 rounded-md font-semibold cursor-pointer text-[#008044] text-sm'
                                              onClick={() => {
                                                setReschedulingId(appointment.id);
                                                setRescheduleDate(appointment.appointment_date.slice(0, 10)); // assumes 'YYYY-MM-DD'
                                                setRescheduleTime(appointment.appointment_time);
                                              }}
                                            >
                                              Reschedule
                                            </button>
                                            <button
                                              className='bg-red-500 p-2 rounded-md font-semibold cursor-pointer text-white text-sm'
                                              onClick={() => ApptDelete(appointment.id)}
                                            >
                                              Delete
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ))}
              </ul>
            </div>}

            {/* PROFILE SECTION */}
            {activeSection === 'profile' &&
            <>
              <div>
                <button className='bg-red-600 text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4 mt-6 mb-6' onClick={() => window.location.replace('/login')}>SIGN OUT</button>
              </div>
              <div>
                <button className='bg-red-600 text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4' onClick={handleDelete} disabled={loading}>DELETE ACCOUNT</button>
              </div>
            </>
            }

            {/* MEDICAL RECORDS SECTION */}
            {activeSection === 'medicalRecords' && 
            <div>

              <div className='bg-white shadow-md rounded-md p-4 md:p-6 w-full mb-6'>
                <div className='flex gap-3 mb-8'>
                  <Image 
                      src="/logo.png"
                      alt="Logo"
                      width={30}
                      height={30}
                    />
                    <h2 className='text-xl font-semibold'>Your Medical Records</h2>
                </div>

                <div className='flex flex-col mb-6'>
                  <h3 className='text-xl font-semibold'>Personal Information</h3>
                  <div className='min-h-1 bg-[#008044]'></div>
                </div>
                <div className='grid grid-cols-2 gap-12'>
                  {/* LEFT */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>First Name</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.first_name || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, first_name: e.target.value } : prev))
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.first_name || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Date of Birth</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold w-full border'
                            type='date'
                            value={editedPatient?.date_of_birth || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, date_of_birth: e.target.value } : prev))
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.date_of_birth || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Sex</label>
                        {isEditing ? (
                          <select
                            className='text-xl font-semibold border border-gray-300 p-2 rounded'
                            value={editedPatient?.sex || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, sex: e.target.value } : prev))
                            }
                          >
                            <option value=''>Select...</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                          </select>
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.sex || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Race</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.race || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, race: e.target.value } : prev))
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.race || ''}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Last Name</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.last_name || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, last_name: e.target.value } : prev))
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.last_name || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Age</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.age || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, age: e.target.value } : prev))
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.age || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Offspring</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.offspring || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, offspring: e.target.value } : prev))
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.offspring || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Nationality</label>
                        {isEditing ? (
                          <select
                            className='text-xl font-semibold border border-gray-300 p-2 rounded'
                            value={editedPatient?.nationality || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) => (prev ? { ...prev, nationality: e.target.value } : prev))
                            }
                          >
                            <option value=''>Select...</option>
                            <option value='Jamaican'>Jamaican</option>
                            <option value='Other'>Other</option>
                          </select>
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.nationality || ''}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>


                <div className='flex flex-col mb-6 mt-12'>
                  <h3 className='text-xl font-semibold'>Biometrics and Physical Data</h3>
                  <div className='min-h-1 bg-[#008044]'></div>
                </div>
                <div className='grid grid-cols-2 gap-12'>
                  {/* LEFT */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Height</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.height || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) =>
                                prev ? { ...prev, height: e.target.value } : prev
                              )
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.height || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>B.M.I.</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.bmi || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) =>
                                prev ? { ...prev, bmi: e.target.value } : prev
                              )
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.bmi || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Blood Type</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.blood_type || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) =>
                                prev ? { ...prev, blood_type: e.target.value } : prev
                              )
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.blood_type || ''}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className='col-span-1'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Weight</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.weight || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) =>
                                prev ? { ...prev, weight: e.target.value } : prev
                              )
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>{patient?.weight || ''}</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Blood Pressure</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.blood_pressure || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) =>
                                prev ? { ...prev, blood_pressure: e.target.value } : prev
                              )
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>
                            {patient?.blood_pressure || ''}
                          </p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label className='text-sm'>Resting Heart Rate</label>
                        {isEditing ? (
                          <input
                            className='text-xl font-semibold border'
                            value={editedPatient?.resting_heart_rate || ''}
                            onChange={(e) =>
                              setEditedPatient((prev) =>
                                prev ? { ...prev, resting_heart_rate: e.target.value } : prev
                              )
                            }
                          />
                        ) : (
                          <p className='text-xl font-semibold'>
                            {patient?.resting_heart_rate || ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>



                {/* Edit/View Toggle */}
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className='flex items-center p-3 gap-2 bg-[#008044] text-white rounded-sm mt-12'
                  >
                    <Image
                      src="/edit.svg"
                      alt='Edit Icon'
                      width={24}
                      height={24}
                    />
                    Update Records
                  </button>
                ) : (
                  <div className="flex gap-4 mt-12">
                    <button onClick={handleSave} className='flex items-center p-3 gap-2 bg-[#008044] text-white rounded-sm'>
                      <Image
                        src="/edit.svg"
                        alt='Confirm Edit Icon'
                        width={24}
                        height={24}
                      />
                      Save
                    </button>
                    <button onClick={handleCancel} className='flex items-center p-3 gap-2 bg-gray-400 text-white rounded-sm'>
                      Cancel
                    </button>
                  </div>
                )}


              </div>
            </div>
            }

            {/* MESSAGING SECTION */}
            {activeSection === 'messaging' && 
              <div></div>
            }

            {/* SETTINGS SECTION */}
            {activeSection === 'settings' && 
            <></>
            }

          </div>


        </div>
      </main>
    </div>
  )
}