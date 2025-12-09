import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { CategoryForm } from '@/components/admin/CategoryForm'

export const dynamic = 'force-dynamic'

export default async function NewCategoryPage() {
  const user = await getCurrentUser()
  if (!user?.isAdmin) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Category</h1>
      <CategoryForm />
    </div>
  )
}

