'use client'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import supabase from '@/app/lib/supabaseClient';
import { Calendar, Clock, CalendarDays} from "lucide-react";
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})

export default function PatientDashboard() {
  const router = useRouter();
  // Section Switcher
  const [activeSection, setActiveSection] = useState('home')


//PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- 
  interface Patient {
    user_id: string;  
    first_name: string;
    last_name: string;
    date_of_birth: string;
    sex: string;
    phone: string;
    age: string;
    height: string;
    weight: string;
    password: string;
    bmi: string;
    blood_pressure: string;
    blood_type: string;
    resting_heart_rate: string;
    race: string;
    nationality: string;
    offspring: string;
  };
  const [patient, setPatient] = useState<Patient | null>(null);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- APPOINTMENT OBJECT -------- 
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
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB --------- PULL APPOINTMENTS FROM DB ---------  
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
  if (activeSection === 'appointments'){
    pullAppointments();
  }
  useEffect(() => {
    pullAppointments();
  }, [patient])
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// FETCH LOGGGED IN USER FROM DB --------- FETCH LOGGGED IN USER FROM DB --------- FETCH LOGGGED IN USER FROM DB --------- FETCH LOGGGED IN USER FROM DB --------- FETCH LOGGGED IN USER FROM DB --------- FETCH LOGGGED IN USER FROM DB --------- FETCH LOGGGED IN USER FROM DB ---------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/patient', {
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok) {
        if (res.status === 401) {
          // Redirect to login or show a message
          window.location.href = '/login';
        } else {
          throw new Error(data.error || 'Failed to fetch patient');
        }
      }

        setPatient(data.patient);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching patient:', err.message);
        }
      }
    };

    fetchUser();
  }, []);
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 
// STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM --------- STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM --------- STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM ---------STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM ---------STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM ---------STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM ---------STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM ---------STORE PATIENT NAME AND REDIRECT TO APPOINTMENT CREATION FORM ---------
  const prepNewAppt = async () => {
    if (!patient) return;
  
    const fullName = `${patient.first_name} ${patient.last_name}`;
    Cookies.set('patientName', fullName, { path: '/' });
  
    router.push('/PATIENTcreateAPPT');
  }
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  

// TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE ---------
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const toggleExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  

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


// UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME ---------
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
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//DELETE USER ACCOUNT --------- DELETE USER ACCOUNT --------- DELETE USER ACCOUNT --------- DELETE USER ACCOUNT--------- DELETE USER ACCOUNT--------- DELETE USER ACCOUNT--------- DELETE USER ACCOUNT--------- DELETE USER ACCOUNT--------- DELETE USER ACCOUNT--------- DELETE USER ACCOUNT 
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")

    if (!confirmed) return

    setLoading(true)

    try {
      if (patient) {
        const res = await fetch('/api/deleteAccount', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: patient.user_id })
        })

        const result = await res.json()

        if (!res.ok) {
          console.error("Failed to delete user:", result.error)
          alert("Failed to delete your account.")
        } else {
          alert("Your account has been deleted.")
          window.location.href = '/register'
        }
      } else {
        alert("You are not authorized to perform this action.")
      }
    } catch (err) {
      console.error("Delete Account Error:", err)
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }
//------------------------------------------------------------------------------------------------------------------------------------------------------------------


// SAVE UPDATED PATIENT DATA --------- SAVE UPDATED PATIENT DATA --------- SAVE UPDATED PATIENT DATA --------- SAVE UPDATED PATIENT DATA --------- SAVE UPDATED PATIENT DATA --------- SAVE UPDATED PATIENT DATA --------- SAVE UPDATED PATIENT DATA ---------
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
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------V
  

// RANDOM HEALTH TIP OF THE DAY --------- RANDOM HEALTH TIP OF THE DAY --------- RANDOM HEALTH TIP OF THE DAY --------- RANDOM HEALTH TIP OF THE DAY --------- RANDOM HEALTH TIP OF THE DAY --------- RANDOM HEALTH TIP OF THE DAY --------- RANDOM HEALTH TIP OF THE DAY ---------
  const [selectedTip, setSelectedTip] = useState('')  
  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await fetch('/api/healthTip')
        const data = await res.json()
        setSelectedTip(data.tip)
      } catch (err) {
        console.error('Failed to fetch tip:', err)
      }
    }

    fetchTip()
  }, [])
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ----------
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
    useEffect(() => {
      if (!patient || activeSection !== 'home') return;
  
      const fetchConfirmedAppointments = async () => {
        const loggedInPatientName = `${patient.first_name ?? ''} ${patient.last_name ?? ''}`.trim();
  
        const now = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);
  
        const formattedNow = now.toISOString().split('T')[0];
        const formattedNextWeek = oneWeekFromNow.toISOString().split('T')[0];
  
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .gte('appointment_date', formattedNow)
          .lte('appointment_date', formattedNextWeek)
          .eq('appointment_status', 'confirmed')
          .eq('patient_name', loggedInPatientName)
          .order('appointment_date', { ascending: true });
  
        if (error) {
          console.error('Error loading appointments:', error);
          return;
        }
  
        setUpcoming(data);
        console.log('Upcoming appointments:', data);
      };
  
      fetchConfirmedAppointments();
    }, [activeSection, patient]);
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  

//BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT --------
  type BlogPost = {
    id: number
    blog_title: string
    blog_author: string
    created_at: string
    blog_preview: string
  }
  const [posts, setPosts] = useState<BlogPost[]>([])
//----------------------------------------------------------------------------------------------------------------------------------------------------------------


// FETCH BLOG POST FROM DB ON LOAD --------- FETCH BLOG POST FROM DB ON LOAD --------- FETCH BLOG POST FROM DB ON LOAD --------- FETCH BLOG POST FROM DB ON LOAD --------- FETCH BLOG POST FROM DB ON LOAD --------- FETCH BLOG POST FROM DB ON LOAD --------- FETCH BLOG POST FROM DB ON LOAD ---------
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/fetchBlogPosts')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch blog posts')
        }

        setPosts(data)
      } catch (err) {
        console.error('Error fetching blog posts:', err)
      }
    }

    fetchPosts()
  }, [])
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------


// DISPLAY CURRENT DATE IN HEADER --------- DISPLAY CURRENT DATE IN HEADER --------- DISPLAY CURRENT DATE IN HEADER --------- DISPLAY CURRENT DATE IN HEADER --------- VDISPLAY CURRENT DATE IN HEADER ---------DISPLAY CURRENT DATE IN HEADER --------- DISPLAY CURRENT DATE IN HEADER ---------
  const [formattedDate, setFormattedDate] = useState('')
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const res = await fetch('/api/displayCurrDate')
        const data = await res.json()
        setFormattedDate(data.date)
      } catch (err) {
        console.error('Failed to fetch date:', err)
      }
    }

    fetchDate()
  }, [])
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <header className={`${montserrat.className}`}>
        <div className="min-w-full h-16 bg-white shadow-lg flex items-center px-4 gap-4">
          <Image 
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <div className='flex flex-col'>
            <h1 className="text-xl font-semibold text-slate-800">Patient Dashboard</h1>
            <p className="text-xs">{formattedDate}</p>
          </div>
          <button className='bg-red-600 text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4 mt-6 mb-6 ml-auto' onClick={() => window.location.replace('/login')}>SIGN OUT</button>
        </div>
      </header>

      <main className={`${montserrat.className} gradient-background min-h-screen min-full-screen p-3`}>
        <div className='flex flex-col gap-4 w-full'>

          
          {/* NAV*/}
          <div className='bg-white shadow-md rounded-lg p-4'>
            <nav>
              <ul className="gap-12 md:gap-24 flex justify-center">
                <li  className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'home' ? 'border-b-4 border-[#3ca444]' : ''}`} onClick={() => setActiveSection('home')}>
                  <Image 
                    src="/home.svg"
                    alt="Home Icon"
                    width={24}
                    height={24}
                  />
                  <span className='hidden md:block text-lg font-semibold'>Home</span>
                </li>
                <li className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'appointments' ? 'border-b-4 border-[#3ca444]' : ''}`} onClick={() => setActiveSection('appointments')}>
                  <Image 
                    src="/calendar.svg"
                    alt="Appointments Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:block text-lg font-semibold">Appointments</span>
                </li>
                <li className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'medicalRecords' ? 'border-b-4 border-[#3ca444]' : ''}`} onClick={() => setActiveSection('medicalRecords')}>
                  <Image 
                    src="/folder-plus.svg"
                    alt="Medical Records Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:block text-lg font-semibold">Medical Records</span>
                </li>
                <li className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'messaging' ? 'border-b-4 border-[#3ca444]' : ''}`} onClick={() => setActiveSection('messaging')}>
                  <Image 
                    src="/message-circle.svg"
                    alt="Message Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:block text-lg font-semibold">Messaging</span>
                </li> 
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className='col-span-5'>

            {/* HOME SECTION */} 
            {activeSection === 'home' && 
            <>
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
                      <p className='underline font-semibold mb-3'>Upcoming Appointments</p>
                      <div>
                        {upcoming.length > 0 ? (
                          <div className="space-y-4">
                            {upcoming.map(appt => (
                              <div key={appt.id} className="group bg-gradient-to-r from-gray-50 to-white p-2 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                        {appt.appointment_title} <br></br><span className='font-medium text-sm'>with</span> Dr. {appt.doctor_name}
                                      </h4>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 stroke-[#3ca444]" stroke="currentColor" />
                                        <span className="font-medium">
                                          {new Date(appt.appointment_date + "T00:00:00").toLocaleDateString('en-US', {
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric'
                                          })}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 stroke-[#3ca444]" stroke="currentColor" />
                                        <span className="font-medium">{appt.appointment_time.slice(0, 5)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                              <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h4>
                            <p className="text-gray-500 text-sm">Your confirmed upcoming appointments will appear here</p>
                              <button className="mt-4 inline-flex items-center px-4 py-2 bg-[#3ca444] text-white text-sm font-medium rounded-lg transition-colors" onClick={() => setActiveSection('appointments')}>
                              <CalendarDays className="w-4 h-4 mr-2" />
                              Schedule Appointment
                            </button>
                          </div>
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
                      <p className='font-[550] text-lg'>{selectedTip}</p>
                    </div>
                    <div>
                      {selectedTip}
                    </div>
                  </div>
                </div>
              </div>
            </>
            }
            
            {/* APPOINTMENTS SECTION */}  
            {activeSection === 'appointments' && 
            <>
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
                  
                                        <div className='flex flex-col md:ml-12 gap-1 md:flex-col'>
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
                                            <div className='md:ml-0 flex flex-col mt-6'>
                                              {appointment.appointment_status === 'pending' && (
                                                <p className="md:ml-0 md:mt-4 flex items-center gap-2 text-red-600">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert blinking-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                                  pending...
                                                </p>
                                              )}
                                              {appointment.appointment_status === 'confirmed' && (
                                                <p className="md:ml-0 md:mt-4 flex items-center gap-2 text-green-600">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
                                                  confirmed.
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                  
                                      <div className={`flex gap-3 ${expandedItems[appointment.id] ? '' : 'hidden'} md:flex`}>
                                        <div className='flex flex-col gap-3 mt-4'>
                                          {reschedulingId === appointment.id ? (
                                            <>
                                            <div className='flex gap-3'>
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
                                            </div>
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
                                            <div className='flex gap-4'>
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
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                </ul>
              </div>
            </>
            }

            {/* MEDICAL RECORDS SECTION */}
            {activeSection === 'medicalRecords' && 
            <>
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
            </>
            }

            {/* MESSAGING SECTION */}
            {activeSection === 'messaging' && 
              <></>
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