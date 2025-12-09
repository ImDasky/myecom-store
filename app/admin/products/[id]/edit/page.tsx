import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { variants: true },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}

