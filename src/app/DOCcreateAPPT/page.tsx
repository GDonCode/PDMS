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

    //FETCH AND STORE DATA OF ALL PATIENTS IN THE DB
    const [patients, setPatients] = useState<Patient[]>([]);
    useEffect(() => {
    const fetchPatients = async () => {
        const { data, error } = await supabase.from('patients').select('*');
        if (error) {
        console.error('Error fetching patients:', error.message);
        } else {
        setPatients(data);
        }
    };

    fetchPatients();
    }, []);

    
    
    
    useEffect(() => {
        const nameFromCookie = Cookies.get('fullName')
        if (nameFromCookie) {
        console.log(nameFromCookie)
        setDoctorName(nameFromCookie)
        }
    }, [])

   const newApptSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent form reload

        if (!doctorName || !apptTitle || !patientName || !apptDate || !apptTime) {
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
            router.push('/dashboard/doctor');
        }
    };
     
    if (!doctorName) {
        return <div className='min-h-screen flex items-center justify-center'>Loading doctor info...</div>;
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
                            <label className="flex items-center gap-2 font-semibold text-gray-700">Choose Patient</label>
                            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#3ca444] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" value={patientName} onChange={(e) => setPatientName(e.target.value)}>
                                <option value="">--</option>
                                {patients.map((patient) => (
                                    <option key={patient.user_id} value={`${patient.first_name} ${patient.last_name}`}>
                                    {patient.first_name} {patient.last_name}
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
                        <button type="button" className='bg-red-600 text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4' onClick={() => router.push('/dashboard/doctor')}>BACK</button>
                    </div>
                </form>
            </main>
        </div>
    </>
    )
}