'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchOpen(false)
      setSearchTerm('')
    }
  }

  if (searchOpen) {
    return (
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          autoFocus
          className="px-3 py-1 border rounded text-sm"
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        <button
          type="submit"
          className="px-3 py-1 bg-gray-900 text-white rounded text-sm hover:bg-gray-800"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen(false)}
          className="px-2 py-1 text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setSearchOpen(true)}
      className="flex items-center gap-1 hover:opacity-70"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline">Search</span>
    </button>
  )
}

