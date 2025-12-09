'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

interface ProductFormProps {
  product?: {
    id: number
    name: string
    slug: string
    description: string | null
    basePrice: number
    images: string
    categoryId: number | null
    isActive: boolean
    variants: Array<{
      id: number
      name: string
      sku: string | null
      price: number | null
      stock: number
      isActive: boolean
    }>
  }
  categories?: Array<{
    id: number
    name: string
  }>
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    basePrice: product?.basePrice || 0,
    images: product?.images ? JSON.parse(product.images).join('\n') : '',
    categoryId: product?.categoryId || null,
    isActive: product?.isActive ?? true,
  })
  const [variants, setVariants] = useState<
    Array<{
      id?: number
      name: string
      sku: string | null
      price: number | null
      stock: number
      isActive: boolean
    }>
  >(product?.variants || [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const images = formData.images
        .split('\n')
        .map((url: string) => url.trim())
        .filter((url: string) => url)

      const res = await fetch(
        product ? `/api/admin/products/${product.id}` : '/api/admin/products',
        {
          method: product ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            images: JSON.stringify(images),
            variants,
          }),
        }
      )

      if (res.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        alert('Error saving product')
      }
    } catch (error) {
      alert('Error saving product')
    } finally {
      setLoading(false)
    }
  }

  const addVariant = () => {
    setVariants([...variants, { name: '', sku: '', price: null, stock: 0, isActive: true }])
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: slugify(e.target.value),
              })
            }}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Base Price (cents) *</label>
        <input
          type="number"
          value={formData.basePrice}
          onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
          required
          min="0"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Category</label>
        <select
          value={formData.categoryId || ''}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : null })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Image URLs (one per line)</label>
        <textarea
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          rows={4}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className="w-full px-4 py-2 border rounded-lg font-mono"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Active</span>
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Add Variant
          </button>
        </div>
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold">SKU</label>
                  <input
                    type="text"
                    value={variant.sku || ''}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold">Price (cents)</label>
                  <input
                    type="number"
                    value={variant.price || ''}
                    onChange={(e) => updateVariant(index, 'price', e.target.value ? parseInt(e.target.value) : null)}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}

