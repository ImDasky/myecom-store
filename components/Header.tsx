import Link from 'next/link'
import { getStoreSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  const settings = await getStoreSettings()
  const user = await getCurrentUser()

  const primaryColor = settings.primaryColor || '#111827'
  const accentColor = settings.secondaryColor || '#2563eb'

  // Get active categories for navigation (gracefully handle if table doesn't exist yet)
  let categories: Array<{ id: number; name: string; slug: string; icon: string | null }> = []
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 10,
    })
  } catch (error: any) {
    // Category table might not exist yet if migrations haven't run
    console.warn('Categories table not available:', error.message)
  }

  return (
    <HeaderClient
      settings={settings}
      user={user}
      categories={categories}
    />
  )
}

