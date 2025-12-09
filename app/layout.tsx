import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getStoreSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Store',
  description: 'Your local hardware store',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getStoreSettings()
  
  return (
    <html lang="en">
      <body className={inter.className} style={{
        '--primary-color': settings.primaryColor || '#111827',
        '--secondary-color': settings.secondaryColor || '#f3f4f6',
      } as React.CSSProperties}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

