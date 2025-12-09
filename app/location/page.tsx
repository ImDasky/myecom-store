import { getStoreSettings } from '@/lib/settings'
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'

export default async function LocationPage() {
  const settings = await getStoreSettings()

  if (!settings.showLocationPage) {
    redirect('/')
  }

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
        Visit Us
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>
              Address
            </h2>
            {settings.businessAddress ? (
              <div className="border rounded-lg p-6 mb-6">
                <p style={{ color: primaryColor }}>
                  {settings.businessAddress}
                  {settings.businessCity && `, ${settings.businessCity}`}
                  {settings.businessState && `, ${settings.businessState}`}
                  {settings.businessZip && ` ${settings.businessZip}`}
                  {settings.businessCountry && `, ${settings.businessCountry}`}
                </p>
              </div>
            ) : (
              <p className="opacity-70">Address not configured.</p>
            )}

            {settings.openingHours && (
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>
                  Hours
                </h2>
                <div 
                  className="border rounded-lg p-6"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <pre className="whitespace-pre-wrap font-sans" style={{ color: primaryColor }}>
                    {settings.openingHours}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>
              Contact Information
            </h2>
            <div className="border rounded-lg p-6 space-y-4">
              {settings.businessPhone && (
                <div>
                  <p className="font-semibold mb-1" style={{ color: primaryColor }}>
                    Phone
                  </p>
                  <a
                    href={`tel:${settings.businessPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {settings.businessPhone}
                  </a>
                </div>
              )}
              {settings.businessEmail && (
                <div>
                  <p className="font-semibold mb-1" style={{ color: primaryColor }}>
                    Email
                  </p>
                  <a
                    href={`mailto:${settings.businessEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {settings.businessEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {settings.mapEmbedHtml && (
        <div className="mt-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: primaryColor }}>
            Find Us
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div
              className="w-full aspect-video"
              dangerouslySetInnerHTML={{ __html: settings.mapEmbedHtml }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

