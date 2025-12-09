import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { FAQForm } from '@/components/admin/FAQForm'

export default async function AdminFAQPage() {
  await requireAdmin()

  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">FAQ Management</h1>
      <FAQForm faqs={faqs} />
    </div>
  )
}

