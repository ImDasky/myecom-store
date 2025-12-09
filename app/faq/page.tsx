import { getStoreSettings } from '@/lib/settings'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function FAQPage() {
  const settings = await getStoreSettings()

  if (!settings.showFAQ) {
    redirect('/')
  }

  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  })

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
        Frequently Asked Questions
      </h1>

      {faqs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg">No FAQs yet.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border rounded-lg overflow-hidden"
              style={{ borderColor: primaryColor + '20' }}
            >
              <div
                className="p-4 font-semibold"
                style={{ backgroundColor: secondaryColor, color: primaryColor }}
              >
                {faq.question}
              </div>
              <div className="p-4" style={{ color: primaryColor }}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

