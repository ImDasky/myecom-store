import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getStoreSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {}
  try {
    settings = await getStoreSettings()
  } catch (error) {
    settings = {}
  }

  const title =
    settings.siteTitle ||
    settings.businessName ||
    'My Store'

  const description =
    settings.metaDescription ||
    'Your local hardware store'

  const ogTitle = settings.ogTitle || title
  const ogDescription = settings.ogDescription || description
  const ogImage = settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined
  const themeColor = settings.themeColor || settings.primaryColor || '#111827'

  return {
    title,
    description,
    metadataBase: settings.canonicalUrl ? new URL(settings.canonicalUrl) : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage,
      url: settings.canonicalUrl,
      siteName: settings.businessName || title,
    },
    twitter: {
      card: settings.twitterCardType || 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    themeColor,
    robots: {
      index: settings.robotsIndex ?? true,
      follow: settings.robotsFollow ?? true,
    },
    icons: {
      icon: settings.faviconUrl || undefined,
      apple: settings.appleTouchIconUrl || undefined,
    },
    other: {
      ...(settings.facebookVerification
        ? { 'facebook-domain-verification': settings.facebookVerification }
        : {}),
      ...(settings.pinterestVerification
        ? { 'p:domain_verify': settings.pinterestVerification }
        : {}),
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings
  try {
    settings = await getStoreSettings()
  } catch (error) {
    // Fallback to defaults if settings can't be loaded
    settings = {
      primaryColor: '#111827',
      secondaryColor: '#f3f4f6',
    } as any
  }
  
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

