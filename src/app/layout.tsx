// src/app/layout.tsx
import './globals.css'
import { SupabaseProvider } from './lib/providers'

export const metadata = {
  title: 'Your App Title',
  description: 'Your description here',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
