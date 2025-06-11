'use client'
import { Montserrat } from 'next/font/google'
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function CreateAppointment(){
    const router = useRouter();
    const [apptTitle, setApptTitle] = useState<string>('');
    const [patientName, setPatientName] = useState<string>('');
    const [doctorName, setDoctorName] = useState<string>();
    const [apptDate, setApptDate] = useState<string>('');
    const [apptTime, setApptTime] = useState<string>(''); 

    //FETCH AND STORE DATA OF ALL DOCTORS IN THE DB
    type Doctor = {
        user_id:string;
        first_name: string;
        last_name: string;
        email:string;
        license_number: string;
        available_hours: string;
        current_availability: string;
        current_medications: string;
        password: string;
    };
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    useEffect(() => {
    const fetchDoctors = async () => {
        const { data, error } = await supabase.from('doctors').select('*');
        if (error) {
        console.error('Error fetching doctors:', error.message);
        } else {
        setDoctors(data);
        }
    };

    fetchDoctors();
    }, []);

    
    useEffect(() => {
        const nameFromCookie = Cookies.get('patientName')
        if (nameFromCookie) {
        setPatientName(nameFromCookie)
        }
    }, [])

   const newApptSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form reload

    if (!doctorName) {
        alert("Please fill out all fields");
        return;
    }

    const { error } = await supabase.from('appointments').insert([
        {
        appointment_title: apptTitle,
        patient_name: patientName,
        doctor_name: doctorName,
        appointment_date: apptDate,
        appointment_time: apptTime,
        },
    ]);

    if (error) {
        console.error("Error creating appointment:", error.message);
        alert("Something went wrong. Please try again.");
    } else {
        alert("Appointment successfully created!");
        router.push('/dashboard/patient');
    }
    }; 

    if (!doctorName) {
        if (doctors.length === 0) {
            return <div className='min-h-screen flex items-center justify-center'>Loading doctor info...</div>;
        }
    }
    return(
    <>
        <div className="font-sans min-h-screen bg-gray-50">
            <header className={`${montserrat.className}`}>
                <div className="min-w-full h-16 bg-white shadow-lg flex items-center pl-4 gap-4">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    <div className='flex flex-col'>
                        <h1 className="text-xl font-semibold text-slate-800">Create New Appointment</h1>
                        <p className='text-xs'>Monday, 26th. May, 2025</p>
                    </div>
                </div>
            </header>

            <main className={`${montserrat.className} gradient-background min-h-screen p-3`}>
                <form className='bg-white shadow-md rounded-lg p-4'>
                    <div className='flex flex-col gap-8'>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-semibold text-gray-700">
                                Appointment Title
                            </label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#3ca444] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="e.g., Regular Check-up, Follow-up Visit"
                                value={apptTitle} 
                                onChange={(e) => setApptTitle(e.target.value)}
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-semibold text-gray-700">
                                Choose Doctor
                            </label>
                            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#3ca444] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
                                <option value="">--</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.user_id} value={`${doctor.first_name} ${doctor.last_name}`}>
                                    {doctor.first_name} {doctor.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700">
                                Appointment Date
                                </label>
                                <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#3ca444] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                value={apptDate} 
                                onChange={(e) => setApptDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700">
                                Appointment Time
                                </label>
                                <input 
                                type="time" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#3ca444] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                value={apptTime} 
                                onChange={(e) => setApptTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="button" className='bg-[#3ca444] text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4 mt-8' onClick={newApptSubmit}>Request New Appointment</button>
                        <button type="button" className='bg-red-600 text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4' onClick={() => router.push('/dashboard/patient')}>BACK</button>
                    </div>
                </form>
            </main>
        </div>
    </>
    )
}