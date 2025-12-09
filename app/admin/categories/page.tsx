import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { CategoryList } from '@/components/admin/CategoryList'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const user = await getCurrentUser()
  if (!user?.isAdmin) {
    redirect('/')
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Category
        </Link>
      </div>

      <CategoryList categories={categories} />
    </div>
  )
}

