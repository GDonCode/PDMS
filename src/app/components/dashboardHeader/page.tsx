'use client'
import Image from 'next/image'

export default function dashboardHeader() {
    return (
        <div className="min-w-full h-16 bg-white shadow-md flex items-center pl-4">
            <Image
                src="logo.png"
                alt="Logo"
                width={40}
                height={40}
            />
            <h1 className="ml-4 text-xl font-semibold text-slate-800">Patient Dashboard</h1>
        </div>
    )
}