import { requireAdmin } from '@/lib/auth'
export const dynamic = 'force-dynamic'
import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/db'

export default async function NewProductPage() {
  await requireAdmin()

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  )
}

