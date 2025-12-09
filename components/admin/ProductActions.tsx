'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductActionsProps {
  productId: number
  editHref: string
}

export function ProductActions({ productId, editHref }: ProductActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to delete')
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={editHref}
        className="text-blue-600 hover:underline font-semibold"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-red-600 hover:underline font-semibold disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

