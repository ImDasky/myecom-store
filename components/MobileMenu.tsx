'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoryIcon } from './CategoryIcon'

interface MobileMenuProps {
  settings: {
    showLocationPage: boolean
    showContactPage: boolean
    showHomepage: boolean
    showProductList: boolean
    showBlog: boolean
    showAccountArea: boolean
  }
  user: { isAdmin: boolean } | null
  categories: Array<{ id: number; name: string; slug: string; icon: string | null }>
}

export function MobileMenu({ settings, user, categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMenu}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {settings.showLocationPage && (
                  <Link
                    href="/location"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-black"
                  >
                    Locations
                  </Link>
                )}
                {settings.showContactPage && (
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-black"
                  >
                    Contact Us
                  </Link>
                )}
                {settings.showHomepage && (
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-black"
                  >
                    About Us
                  </Link>
                )}
                {settings.showProductList && (
                  <div className="space-y-2">
                    <Link
                      href="/products"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-black"
                    >
                      All Products
                    </Link>
                    {categories.length > 0 && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-4">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            onClick={closeMenu}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-black"
                          >
                            <CategoryIcon iconName={category.icon} className="w-5 h-5" />
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {settings.showBlog && (
                  <Link
                    href="/blog"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-black"
                  >
                    Resource Hub
                  </Link>
                )}
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-black"
                  >
                    Admin
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}

