import Link from 'next/link'
import { getStoreSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'
import { CartButton } from './CartButton'

export async function Header() {
  const settings = await getStoreSettings()
  const user = await getCurrentUser()

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <header 
      className="sticky top-0 z-50 border-b"
      style={{ 
        backgroundColor: secondaryColor,
        borderColor: primaryColor + '20'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.businessName || 'Store'} 
                className="h-10 w-auto"
              />
            ) : (
              <h1 
                className="text-2xl font-bold"
                style={{ color: primaryColor }}
              >
                {settings.businessName || 'My Store'}
              </h1>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {settings.showHomepage && (
              <Link href="/" className="hover:opacity-70" style={{ color: primaryColor }}>
                Home
              </Link>
            )}
            {settings.showProductList && (
              <Link href="/products" className="hover:opacity-70" style={{ color: primaryColor }}>
                Products
              </Link>
            )}
            {settings.showBlog && (
              <Link href="/blog" className="hover:opacity-70" style={{ color: primaryColor }}>
                Blog
              </Link>
            )}
            {settings.showFAQ && (
              <Link href="/faq" className="hover:opacity-70" style={{ color: primaryColor }}>
                FAQ
              </Link>
            )}
            {settings.showLocationPage && (
              <Link href="/location" className="hover:opacity-70" style={{ color: primaryColor }}>
                Location
              </Link>
            )}
            {settings.showContactPage && (
              <Link href="/contact" className="hover:opacity-70" style={{ color: primaryColor }}>
                Contact
              </Link>
            )}
            {settings.showAccountArea && (
              <>
                {user ? (
                  <Link href="/account" className="hover:opacity-70" style={{ color: primaryColor }}>
                    Account
                  </Link>
                ) : (
                  <Link href="/auth/login" className="hover:opacity-70" style={{ color: primaryColor }}>
                    Login
                  </Link>
                )}
              </>
            )}
            {user?.isAdmin && (
              <Link href="/admin" className="hover:opacity-70" style={{ color: primaryColor }}>
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  )
}

