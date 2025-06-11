'use client'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import PatientMedicalForm from '@/app/components/patientMedicalForm';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import supabase from '@/app/lib/supabaseClient';
import { Calendar, Clock, CalendarDays, UserRoundSearch, SlidersHorizontal } from "lucide-react";
import type { Patient } from '@/app/types/patient.ts';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})
export default function DoctorDashboard() {
  const router = useRouter();
  // Section Switcher
  const [activeSection, setActiveSection] = useState('home')

// DOCTOR OBJECT --------- DOCTOR OBJECT --------- DOCTOR OBJECT --------- DOCTOR OBJECT --------- DOCTOR OBJECT --------- DOCTOR OBJECT --------- DOCTOR OBJECT ---------
  interface Doctor {
    user_id: string;
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
// ------------------------------------------------------------------------------------------------------------------------------------------------------

// APPOINTMENT OBJECT --------- APPOINTMENT OBJECT --------- APPOINTMENT OBJECT --------- APPOINTMENT OBJECT --------- APPOINTMENT OBJECT --------- APPOINTMENT OBJECT ---------
  interface Appointment {
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
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

//PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- PATIENT OBJECT --------- 
  const [allPatients, setAllPatients] = useState<any[]>([]);
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB --------- FETCH APPOINTMENTS FROM DB ---------
  const pullAppointments = async () => {
    if (!doctor) return;
    const fullName = `${doctor.first_name} ${doctor.last_name}`;
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_name', fullName);

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(appointments);
    }
  };
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM --------- REDIRECT TO APPOINTMENT CREATION FORM ---------
  const prepNewAppt = async () => {
    if (!doctor) return;
  
    const doctorName = `${doctor.first_name} ${doctor.last_name}`;
    Cookies.set('fullName', doctorName, { path: '/' });
    
    router.push('/DOCcreateAPPT')
  }
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// CONFIRM APPOINTMENT --------- CONFIRM APPOINTMENT --------- CONFIRM APPOINTMENT --------- CONFIRM APPOINTMENT--------- CONFIRM APPOINTMENT--------- CONFIRM APPOINTMENT--------- CONFIRM APPOINTMENT--------- CONFIRM APPOINTMENT--------- CONFIRM APPOINTMENT
  const ApptConfirm = async (id: string) => {
    const confirmed = confirm("Are you sure you want to confirm this appointment?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('appointments')
      .update({ appointment_status: 'confirmed' })
      .eq('id', id);

    if (error) {
      console.error('Error confirming appointment:', error);
    } else {
      pullAppointments();
    }
  };
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// UNCONFIRM APPOINTMENT --------- UNCONFIRM APPOINTMENT --------- UNCONFIRM APPOINTMENT --------- UNCONFIRM APPOINTMENT--------- UNCONFIRM APPOINTMENT--------- UNCONFIRM APPOINTMENT--------- UNCONFIRM APPOINTMENT--------- UNCONFIRM APPOINTMENT--------- UNCONFIRM APPOINTMENT
  const ApptUnConfirm = async (id: string) => {
    const confirmed = confirm("Are you sure you want to unconfirm this appointment?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('appointments')
      .update({ appointment_status: 'pending' })
      .eq('id', id);

    if (error) {
      console.error('Error unconfirming appointment:', error);
    } else {
      pullAppointments();
    }
  };
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
// FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH CURRENT USER --------- FETCH USER --------- FETCH USER --------- 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/doctor', {
          credentials: 'include',
        });
        const data = await res.json();

        
      if (!res.ok) {
        if (res.status === 401) {
          // Redirect to login or show a message
          window.location.href = '/login';
        } else {
          throw new Error(data.error || 'Failed to fetch doctor');
        }
      }

        setDoctor(data);
      } catch (err) {
        console.error('Error fetching doctor:', err);
      }
    };

    fetchUser();
  }, []);
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
// FETCH ALL REGISTERED PATIENTS --------- FETCH ALL REGISTERED PATIENTS --------- FETCH ALL REGISTERED PATIENTS --------- FETCH ALL REGISTERED PATIENTS --------- FETCH ALL REGISTERED PATIENTS --------- FETCH ALL REGISTERED PATIENTS --------- FETCH ALL REGISTERED PATIENTS ---------
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setAllPatients(data);
      }
    };

    fetchPatients();
  }, []);

  if (error) return <div>Error: {error}</div>;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// FETCH APPOINTMENTS --------- FETCH APPOINTMENTS --------- FETCH APPOINTMENTS --------- FETCH APPOINTMENTS --------- FETCH APPOINTMENTS --------- FETCH APPOINTMENTS --------- FETCH APPOINTMENTS ---------
  useEffect(() => {
    pullAppointments();
  }, [doctor])
  if (activeSection === 'appointments'){
    pullAppointments();
  }
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE --------- TOGGLE APPOINTMENT CARD EXPANSION ON MOBILE ---------
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const toggleExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

// UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME --------- UPDATE APPOINTMENT DATE AND TIME ---------
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const handleUpdate = async (id: string) => {
      // call your backend function here if needed
      try {
        await updateAppointment(id, rescheduleDate, rescheduleTime); // replace with actual API/db update call

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
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//DELETE ACCOUNT --------- DELETE ACCOUNT --------- DELETE ACCOUNT --------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT--------- DELETE ACCOUNT 
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")

    if (!confirmed) return

    setLoading(true)

    try {
      if (doctor) {
        const res = await fetch('/api/deleteAccount', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: doctor.user_id })
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

// SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- SHOW UPCOMING CONFIRMED APPOINTMENTS ON HOME ---------- 
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  useEffect(() => {
    if (!doctor || activeSection !== 'home') return;

    const fetchConfirmedAppointments = async () => {
      const loggedInDoctorName = `${doctor.first_name ?? ''} ${doctor.last_name ?? ''}`.trim();

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
        .eq('doctor_name', loggedInDoctorName)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error loading appointments:', error);
        return;
      }

      setUpcoming(data);
      console.log('Upcoming appointments:', data);
    };

    fetchConfirmedAppointments();
  }, [activeSection, doctor]);




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

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    
//BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT -------- BLOG POST OBJECT --------
interface BlogPost {
    id: number
    blog_title: string
    blog_author: string
    created_at: string
    blog_preview: string
  }
  const [posts, setPosts] = useState<BlogPost[]>([])
//----------------------------------------------------------------------------------------------------------------------------------------------------------------

// FETCH BLOG POST FROM DB --------- FETCH BLOG POST FROM DB --------- FETCH BLOG POST FROM DB --------- FETCH BLOG POST FROM DB --------- FETCH BLOG POST FROM DB --------- FETCH BLOG POST FROM DB --------- FETCH BLOG POST FROM DB ---------
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
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM --------- REDIRECT TO BLOG CREATION FORM ---------
  const prepNewBlogPost = async () => {
    if (!doctor) return;
  
    const doctorName = `${doctor.first_name} ${doctor.last_name}`;
    Cookies.set('fullName', doctorName, { path: '/' });
    
    router.push('/createBlogPost')
  }
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// SEARCH AND FILTER FUNCTIONALITY --------- SEARCH AND FILTER FUNCTIONALITY --------- SEARCH AND FILTER FUNCTIONALITY --------- SEARCH AND FILTER  FUNCTIONALITY --------- SEARCH AND FILTER FUNCTIONALITY ---------
  const [searchTerm, setSearchTerm] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPatients = allPatients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const matchesName = fullName.includes(searchTerm.toLowerCase());
    const matchesSex = sexFilter ? p.sex === sexFilter : true;

    const age = parseInt(p.age, 10);
    const min = minAge ? parseInt(minAge, 10) : null;
    const max = maxAge ? parseInt(maxAge, 10) : null;

    const matchesAge =
      (!min || age >= min) &&
      (!max || age <= max);

    return matchesName && matchesSex && matchesAge;
  });


  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const handleRecordsSubmit = async () => {
    if (!selectedPatient || !selectedPatient.user_id) return;

    const { user_id, ...updateFields } = selectedPatient;

    const { error: updateError } = await supabase
      .from('patients')
      .update(updateFields)
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Update failed:', updateError.message);
      alert('Failed to update patient');
      return;
    }

    // ✅ Fetch updated list
    const { data: refreshedPatients, error: fetchError } = await supabase
      .from('patients')
      .select('*');

    if (fetchError) {
      console.error('Failed to refresh patients:', fetchError.message);
      alert('Update succeeded, but refresh failed');
    } else {
      setAllPatients(refreshedPatients); // Update the table data
      alert('Patient updated successfully');
    }

    setSelectedPatient(null); // Go back to the table
  };

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
            <h1 className="text-xl font-semibold text-slate-800">Doctor Dashboard</h1>
            <p className='text-xs'>{formattedDate}</p>
          </div>
        </div>
        {/*NAV*/}
          <div className='bg-white shadow-md rounded-lg pb-4'>
            <nav>
              <ul className="gap-12 md:gap-24 flex justify-center">
                <li  className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'home' ? 'border-b-4 border-[#3ca444]' : ''}`}
                  onClick={() => setActiveSection('home')}>
                    <Image 
                      src="/home.svg"
                      alt="Home Icon"
                      width={24}
                      height={24}
                    />
                  <span className='hidden md:block text-lg font-semibold'>Home</span>
                </li>
                <li className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'appointments' ? 'border-b-4 border-[#3ca444]' : ''}`}
                  onClick={() => setActiveSection('appointments')}>
                  <Image 
                    src="/calendar.svg"
                    alt="Appointments Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:block text-lg font-semibold">Appointments</span>
                </li>
                <li className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'patientRecords' ? 'border-b-4 border-[#3ca444]' : ''}`}
                  onClick={() => setActiveSection('patientRecords')}>
                  <Image 
                    src="/folder-plus.svg"
                    alt="Medical Records Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:block text-lg font-semibold">Patient Records</span>
                </li>
                <li className={`flex gap-2 items-center p-2 cursor-pointer ${activeSection === 'messaging' ? 'border-b-4 border-[#3ca444]' : ''}`}
                  onClick={() => setActiveSection('messaging')}>
                  <Image 
                    src="/message-circle.svg"
                    alt="Messaging Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:block text-lg font-semibold">Messaging</span>
                </li> 
              </ul>
            </nav>
          </div>
      </header>

      <main className={`${montserrat.className} gradient-background min-h-screen p-2`}>
        <div className='flex flex-col gap-4 p-2'>

          {/* Main Content */}
          <div className='col-span-5'>

            {/* HOME SECTION */} 
            {activeSection === 'home' && 
            <>
              <div className='flex flex-col gap-6'>
                <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
                  <div className='flex w-fit items-center gap-3 mb-4'>
                    <Image 
                      src="/logo.png"
                      alt="Logo"
                      width={24}
                      height={24}
                    />
                    <h2 className='text-lg font-semibold'>Welcome, Dr. <span id="doctorName">{doctor?.last_name || 'User'}</span>.</h2>
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
                                      {appt.appointment_title} <br></br><span className='font-medium text-sm'>with</span> {appt.patient_name}
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
                    <div className='flex items-center gap-2 border-b-4 border-[#3ca444]'>
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

                {/* BLOG */}
                <div className='bg-white shadow=md rounded-lg p-4 md:p-6 flex flex-col gap-3'>
                  <div className='flex items-center gap-2 border-b-4 border-[#3ca444]'>
                    <Image 
                      src="/info.svg"
                      width={16}
                      height={16}
                      alt="Information Icon"
                    />
                    <p className='font-[550] text-lg'>Blog Posts</p>
                    
                  </div>
                
                
                  {posts.map((post) => (
                    <div key={post.id} className='bg-gray-50 rounded-md shadow-lg p-4'>
                      <div className='flex flex-col mb-4 gap-1'>
                        <p className='font-[550] text-lg underline'>{post.blog_title}</p>
                        <div className='flex justify-between'>
                          <p className='text-sm'>
                            by <span className='font-semibold'>{post.blog_author}</span>
                          </p>
                          <p className='text-sm'>{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div> 
                      <div>{post.blog_preview}</div>
                      <button className='mt-3 bg-[#008044] text-white p-2 rounded-sm'>View Post</button>
                    </div>
                  ))}
                </div>


              </div>
            </>
            }
            
            {/* APPOINTMENTS SECTION */}  
            {activeSection === 'appointments' && 
            <>
              <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
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
                  <button className='bg-[#008044] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm' onClick={prepNewAppt}>Create New Appointment</button>
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
                    className='bg-white p-4 w-full rounded-lg shadow-md flex flex-col gap-2 md:flex-row justify-between md:items-start border-2 border-gray-200'
                  >
                    <div>
                      <div className='flex items-center gap-6 mb-3 md:mb-0' onClick={() => toggleExpansion(appointment.id)} style={{ cursor: 'pointer' }}>
                        <Image 
                          src="/clipboard.svg"
                          alt="Appointment Icon"
                          width={24}
                          height={24}
                        />
                        <div className='flex w-full'>
                          <div>
                            <p className='font-semibold'>{appointment.appointment_title}</p>
                            <p>{appointment.patient_name}</p>
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
                        
                        {/* Status for mobile - keep original position */}
                        <div className='md:hidden'>
                          <div className='flex flex-col mt-6'>
                            {appointment.appointment_status === 'pending' && (
                              <p className="flex items-center gap-2 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert blinking-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                pending...
                              </p>
                            )}
                            {appointment.appointment_status === 'confirmed' && (
                              <p className="flex items-center gap-2 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
                                confirmed.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Status above buttons */}
                    <div className='hidden md:flex md:flex-col md:items-end md:gap-3'>
                      {/* Status for desktop - moved above buttons */}
                      <div>
                        {appointment.appointment_status === 'pending' && (
                          <p className="flex items-center gap-2 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert blinking-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                            pending...
                          </p>
                        )}
                        {appointment.appointment_status === 'confirmed' && (
                          <p className="flex items-center gap-2 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
                            confirmed.
                          </p>
                        )}
                      </div>
                      
                      {/* Buttons */}
                      <div className='flex gap-3'>
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
                            <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold text-sm' onClick={() => handleUpdate(appointment.id)}>
                              Update
                            </button>
                            <button className='bg-gray-300 text-black p-2 rounded-md font-semibold text-sm' onClick={() => setReschedulingId(null)}>
                              Close
                            </button>
                          </>
                        ) : (
                          <>
                            {appointment.appointment_status === 'confirmed' ? (
                              <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm' onClick={() => ApptUnConfirm(appointment.id)}>
                                Unconfirm
                              </button>
                            ) : (
                              <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm' onClick={() => ApptConfirm(appointment.id)}>
                                Confirm
                              </button>
                            )}
                            <button className='bg-gray-300 p-2 rounded-md font-semibold cursor-pointer text-[#008044] text-sm'
                              onClick={() => {
                                setReschedulingId(appointment.id);
                                setRescheduleDate(appointment.appointment_date.slice(0, 10));
                                setRescheduleTime(appointment.appointment_time);
                              }}
                            >
                              Reschedule
                            </button>
                            <button className='bg-red-500 p-2 rounded-md font-semibold cursor-pointer text-white text-sm' onClick={() => ApptDelete(appointment.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                      <button className='w-full bg-[#0d82ca] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-lg'>Mark Appointment as Complete</button>
                    </div>

                    {/* Mobile: Original expandable buttons section */}
                    <div className={`flex gap-3 mt-2 ${expandedItems[appointment.id] ? '' : 'hidden'} md:hidden`}>
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
                          <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold text-sm' onClick={() => handleUpdate(appointment.id)}>
                            Update
                          </button>
                          <button className='bg-gray-300 text-black p-2 rounded-md font-semibold text-sm' onClick={() => setReschedulingId(null)}>
                            Close
                          </button>
                        </>
                      ) : (
                        <div className='flex flex-col gap-3'>
                          <div className='flex gap-3'>
                            {appointment.appointment_status === 'confirmed' ? (
                              <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm' onClick={() => ApptUnConfirm(appointment.id)}>
                                Unconfirm
                              </button>
                            ) : (
                              <button className='bg-[#3ca444] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4 text-sm' onClick={() => ApptConfirm(appointment.id)}>
                                Confirm
                              </button>
                            )}
                            <button className='bg-gray-300 p-2 rounded-md font-semibold cursor-pointer text-[#008044] text-sm'
                              onClick={() => {
                                setReschedulingId(appointment.id);
                                setRescheduleDate(appointment.appointment_date.slice(0, 10));
                                setRescheduleTime(appointment.appointment_time);
                              }}
                            >
                              Reschedule
                            </button>
                            <button className='bg-red-500 p-2 rounded-md font-semibold cursor-pointer text-white text-sm' onClick={() => ApptDelete(appointment.id)}>
                              Delete
                            </button>
                          </div>
                          <div>
                            <button className='w-full bg-[#0d82ca] text-white p-2 rounded-md font-semibold cursor-pointer md:px-4'>Mark Appointment as Complete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            </>
            }

            {/* PATIENT RECORDS SECTION */}
            {activeSection === 'patientRecords' && 
            <>
              <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
                <div className='flex gap-3 mb-6'>
                  <Image 
                    src="/logo.png"
                    alt="Logo"
                    width={30}
                    height={30}
                  />
                  <h2 className='text-xl font-semibold'>Search Patient Records</h2>
                </div>

                {selectedPatient ? (
                <>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="mb-4 px-4 py-2 bg-[#3ca444] text-white rounded hover:bg-[#33953a] focus:outline-none focus:ring-2 focus:ring-[#3ca444]"
                  >
                    ← Back to Table
                  </button>

                  <PatientMedicalForm
                    patient={selectedPatient}
                    setPatient={setSelectedPatient}
                    handleSubmit={handleRecordsSubmit}
                  />
                </>
                ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    {/* Search input */}
                    <div className="relative w-full md:w-1/3">
                      <UserRoundSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3ca444]"/>
                    </div>

                    {/* Filter toggle button */}
                    <button onClick={() => setShowFilters(!showFilters)} className="text-gray-500 flex items-center gap-2 px-4 py-2 rounded border hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3ca444] transition">
                      <SlidersHorizontal className="text-gray-500" />
                      Filters
                    </button>
                  </div>

                  {/* Filter options (age and gender) */}
                  {showFilters && (
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                      {/* Gender Filter */}
                      <select
                        value={sexFilter}
                        onChange={(e) => setSexFilter(e.target.value)}
                        className="w-full md:w-1/4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3ca444]"
                      >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>

                      {/* Age Filter */}
                      <div className="flex gap-2 w-full md:w-1/2">
                        <input
                          type="number"
                          placeholder="Min Age"
                          value={minAge}
                          onChange={(e) => setMinAge(e.target.value)}
                          className="w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3ca444]"
                        />
                        <input
                          type="number"
                          placeholder="Max Age"
                          value={maxAge}
                          onChange={(e) => setMaxAge(e.target.value)}
                          className="w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3ca444]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                      <thead className="bg-[#3ca444] text-left text-sm font-semibold text-white">
                        <tr>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Gender</th>
                          <th className="py-3 px-4">Age</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Last Visit</th>
                        </tr>
                      </thead>
                      <tbody className="text-lg text-gray-800">
                        {filteredPatients.map((patient, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-200 transition`} onClick={() => setSelectedPatient(patient)}>
                            <td className="py-3 px-4 font-medium">
                              {patient.first_name} {patient.last_name}
                            </td>
                            <td className="py-3 px-4">{patient.sex}</td>
                            <td className="py-3 px-4">{patient.age}</td>
                            <td className="py-3 px-4">{patient.phone || '—'}</td>
                            <td className="py-3 px-4">{patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
                )}
              </div>
            </>
            }

            {/* MESSAGING SECTION */}
            {activeSection === 'messaging' && 
            <>
              <div className="flex flex-col h-full max-h-[90vh] border rounded-lg shadow-md bg-white">
    
              {/* Chat Header */}
              <div className="px-4 py-3 border-b bg-gray-100 font-semibold text-lg">
                Chat with Support
              </div>

              {/* Messages Display Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {/* Incoming Message */}
                <div className="flex items-start space-x-2">
                  <div className="bg-gray-200 p-3 rounded-xl max-w-xs">
                    <p>Hello! How can I help you today?</p>
                  </div>
                </div>

                {/* Outgoing Message */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white p-3 rounded-xl max-w-xs">
                    <p>I have a question about my records.</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <form className="flex items-center p-3 border-t bg-white">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                  Send
                </button>
              </form>
              </div>
            </>
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