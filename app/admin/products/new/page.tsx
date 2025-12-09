import { requireAdmin } from '@/lib/auth'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">New Product</h1>
      <ProductForm />
    </div>
  )
}

