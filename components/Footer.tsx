import Link from 'next/link'
import { getStoreSettings } from '@/lib/settings'

export async function Footer() {
  const settings = await getStoreSettings()

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <footer 
      className="border-t mt-auto"
      style={{ 
        backgroundColor: secondaryColor,
        borderColor: primaryColor + '20'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.businessName || 'Store'} 
                className="h-8 w-auto mb-4"
              />
            ) : (
              <h3 
                className="text-xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                {settings.businessName || 'My Store'}
              </h3>
            )}
            {settings.aboutText && (
              <p className="text-sm opacity-70" style={{ color: primaryColor }}>
                {settings.aboutText.substring(0, 150)}...
              </p>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: primaryColor }}>Quick Links</h4>
            <ul className="space-y-2">
              {settings.showProductList && (
                <li>
                  <Link href="/products" className="text-sm hover:opacity-70" style={{ color: primaryColor }}>
                    Products
                  </Link>
                </li>
              )}
              {settings.showBlog && (
                <li>
                  <Link href="/blog" className="text-sm hover:opacity-70" style={{ color: primaryColor }}>
                    Blog
                  </Link>
                </li>
              )}
              {settings.showFAQ && (
                <li>
                  <Link href="/faq" className="text-sm hover:opacity-70" style={{ color: primaryColor }}>
                    FAQ
                  </Link>
                </li>
              )}
              {settings.showContactPage && (
                <li>
                  <Link href="/contact" className="text-sm hover:opacity-70" style={{ color: primaryColor }}>
                    Contact
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: primaryColor }}>Contact</h4>
            <ul className="space-y-2 text-sm" style={{ color: primaryColor }}>
              {settings.businessEmail && (
                <li>
                  <a href={`mailto:${settings.businessEmail}`} className="hover:opacity-70">
                    {settings.businessEmail}
                  </a>
                </li>
              )}
              {settings.businessPhone && (
                <li>
                  <a href={`tel:${settings.businessPhone}`} className="hover:opacity-70">
                    {settings.businessPhone}
                  </a>
                </li>
              )}
              {settings.businessAddress && (
                <li className="opacity-70">
                  {settings.businessAddress}
                  {settings.businessCity && `, ${settings.businessCity}`}
                  {settings.businessState && `, ${settings.businessState}`}
                  {settings.businessZip && ` ${settings.businessZip}`}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: primaryColor }}>Follow Us</h4>
            <div className="flex gap-4">
              {settings.facebookUrl && (
                <a 
                  href={settings.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                  style={{ color: primaryColor }}
                >
                  Facebook
                </a>
              )}
              {settings.instagramUrl && (
                <a 
                  href={settings.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                  style={{ color: primaryColor }}
                >
                  Instagram
                </a>
              )}
              {settings.twitterUrl && (
                <a 
                  href={settings.twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                  style={{ color: primaryColor }}
                >
                  Twitter
                </a>
              )}
              {settings.tiktokUrl && (
                <a 
                  href={settings.tiktokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                  style={{ color: primaryColor }}
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm opacity-70" style={{ 
          borderColor: primaryColor + '20',
          color: primaryColor 
        }}>
          © {new Date().getFullYear()} {settings.businessName || 'My Store'}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

