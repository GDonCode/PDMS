'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col gap-2 items-center justify-center min-h-screen bg-gray-50">
      <Link
        href="/login"
        className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Register
      </Link>
      <Link
        href="/test"
        className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Test
      </Link>
      <Link
        href="/admin"
        className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Admin
      </Link>
    </main>
  )
}