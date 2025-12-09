import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getStoreSettings, clearSettingsCache } from '@/lib/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  await requireAdmin()
  const settings = await getStoreSettings()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Store Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}

