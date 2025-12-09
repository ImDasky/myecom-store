import { getStoreSettings } from '@/lib/settings'
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'

export default async function ContactPage() {
  const settings = await getStoreSettings()

  if (!settings.showContactPage) {
    redirect('/')
  }

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
        Contact Us
      </h1>

      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {settings.businessEmail && (
            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-lg mb-2" style={{ color: primaryColor }}>
                Email
              </h3>
              <a
                href={`mailto:${settings.businessEmail}`}
                className="text-blue-600 hover:underline"
              >
                {settings.businessEmail}
              </a>
            </div>
          )}

          {settings.businessPhone && (
            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-lg mb-2" style={{ color: primaryColor }}>
                Phone
              </h3>
              <a
                href={`tel:${settings.businessPhone}`}
                className="text-blue-600 hover:underline"
              >
                {settings.businessPhone}
              </a>
            </div>
          )}
        </div>

        {settings.businessAddress && (
          <div className="border rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4" style={{ color: primaryColor }}>
              Address
            </h3>
            <p style={{ color: primaryColor }}>
              {settings.businessAddress}
              {settings.businessCity && `, ${settings.businessCity}`}
              {settings.businessState && `, ${settings.businessState}`}
              {settings.businessZip && ` ${settings.businessZip}`}
              {settings.businessCountry && `, ${settings.businessCountry}`}
            </p>
          </div>
        )}

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4" style={{ color: primaryColor }}>
            Send us a message
          </h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold" style={{ color: primaryColor }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: primaryColor + '40' }}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold" style={{ color: primaryColor }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: primaryColor + '40' }}
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-semibold" style={{ color: primaryColor }}>
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: primaryColor + '40' }}
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

