'use client'
import { Montserrat } from 'next/font/google'
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'], // Add weights as needed
  variable: '--font-montserrat' // Optional: to use as CSS variable
})
import Image from 'next/image'
import supabase from '@/app/lib/supabaseClient';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function CreateBlogPost() {
    const router = useRouter();
    const [doctorName, setDoctorName] = useState<string>();

    const [postTitle, setPostTitle] = useState<string>('');
    useEffect(() => {
        const nameFromCookie = Cookies.get('fullName')
        if (nameFromCookie) {
        console.log(nameFromCookie)
        setDoctorName(nameFromCookie)
        }
    }, [])


    const newBlogPostSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent form reload
        console.log("im here.")
    }

    return (
        <>
            <div className="font-sans min-h-screen bg-gray-50">
                <header className={`${montserrat.className}`}>
                    <div className="min-w-full h-16 bg-white shadow-lg flex items-center pl-4 gap-4">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} />
                        <div className='flex flex-col'>
                            <h1 className="text-xl font-semibold text-slate-800">Create New Blog Post</h1>
                            <p className='text-xs'>Monday, 26th. May, 2025</p>
                        </div>
                    </div>
                </header>
        
                <main className={`${montserrat.className} bg-white min-h-screen p-3`}>
                    <form className='mt-8'>
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-col'>
                                <label className='font-semibold text-xl'>Post Title</label>
                                <input type='text' className='border rounded-xs text-lg' value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
                            </div>

                            <button type="button" className='bg-[#3ca444] text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4 mt-8' onClick={newBlogPostSubmit}>Request New Appointment</button>
                            <button type="button" className='bg-red-600 text-white text-xl p-2 rounded-md font-semibold cursor-pointer md:px-4' onClick={() => router.push('/dashboard/doctor')}>BACK</button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}