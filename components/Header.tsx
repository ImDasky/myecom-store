import Link from 'next/link'
import { getStoreSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'
import { CartButton } from './CartButton'
import { SearchButton } from './SearchButton'
import { MobileMenu } from './MobileMenu'
import { prisma } from '@/lib/db'

export async function Header() {
  const settings = await getStoreSettings()
  const user = await getCurrentUser()

  const primaryColor = settings.primaryColor || '#111827'
  const accentColor = settings.secondaryColor || '#2563eb'

  // Get active categories for navigation (gracefully handle if table doesn't exist yet)
  let categories: Array<{ id: number; name: string; slug: string; icon: string | null }> = []
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 10,
    })
  } catch (error: any) {
    // Category table might not exist yet if migrations haven't run
    console.warn('Categories table not available:', error.message)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              {settings.businessPhone && (
                <a 
                  href={`tel:${settings.businessPhone}`}
                  className="font-semibold hover:opacity-70 transition-opacity text-black"
                >
                  {settings.businessPhone}
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {settings.showSearch && <SearchButton />}
              <CartButton />
              {settings.showAccountArea && (
                <>
                  {user ? (
                    <Link 
                      href="/account" 
                      className="hover:opacity-70 transition-opacity font-medium text-black"
                    >
                      My Account
                    </Link>
                  ) : (
                    <>
                      <Link 
                        href="/auth/login" 
                        className="hover:opacity-70 transition-opacity text-black"
                      >
                        Sign In
                      </Link>
                      <span className="text-gray-400">/</span>
                      <Link 
                        href="/auth/register" 
                        className="hover:opacity-70 transition-opacity text-black"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.businessName || 'Store'} 
                className="h-20 w-auto"
              />
            ) : (
              <h1 
                className="text-3xl font-bold text-black"
              >
                {settings.businessName || 'My Store'}
              </h1>
            )}
          </Link>

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {settings.showLocationPage && (
              <Link 
                href="/location" 
                className="font-semibold hover:text-gray-600 transition-colors text-black text-base"
              >
                Locations
              </Link>
            )}
            {settings.showContactPage && (
              <Link 
                href="/contact" 
                className="font-semibold hover:text-gray-600 transition-colors text-black text-base"
              >
                Contact Us
              </Link>
            )}
            {settings.showHomepage && (
              <Link 
                href="/" 
                className="font-semibold hover:text-gray-600 transition-colors text-black text-base"
              >
                About Us
              </Link>
            )}
            {settings.showProductList && (
              <div className="relative group">
                <Link 
                  href="/products" 
                  className="font-semibold hover:text-gray-600 transition-colors flex items-center gap-1 text-black text-base"
                >
                  Products
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {categories.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="block px-4 py-2 hover:bg-gray-50 rounded transition-colors text-black"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <Link
                        href="/products"
                        className="block px-4 py-2 hover:bg-gray-50 rounded transition-colors font-semibold border-t border-gray-200 mt-2 pt-2 text-black"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            {settings.showBlog && (
              <Link 
                href="/blog" 
                className="font-semibold hover:text-gray-600 transition-colors text-black text-base"
              >
                Resource Hub
              </Link>
            )}
            {user?.isAdmin && (
              <Link 
                href="/admin" 
                className="font-semibold hover:text-gray-600 transition-colors text-black text-base"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <MobileMenu
            settings={{
              showLocationPage: settings.showLocationPage,
              showContactPage: settings.showContactPage,
              showHomepage: settings.showHomepage,
              showProductList: settings.showProductList,
              showBlog: settings.showBlog,
              showAccountArea: settings.showAccountArea,
            }}
            user={user}
            categories={categories}
          />
        </div>
      </div>
    </header>
  )
}

