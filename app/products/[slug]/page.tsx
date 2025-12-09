import { getStoreSettings } from '@/lib/settings'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/AddToCartButton'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const settings = await getStoreSettings()
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { variants: { where: { isActive: true }, orderBy: { name: 'asc' } } },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const images = product.images ? JSON.parse(product.images) : []
  const primaryColor = settings.primaryColor || '#111827'
  const accentColor = settings.secondaryColor || '#2563eb'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          {images[0] ? (
            <div className="aspect-square relative bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {images.slice(1).map((img: string, idx: number) => (
                <div key={idx} className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-5xl font-bold mb-4 text-black leading-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-semibold mb-8 text-black">
            {product.variants.length > 0
              ? `${formatPrice(Math.min(...product.variants.map(v => v.price || product.basePrice)))} - ${formatPrice(Math.max(...product.variants.map(v => v.price || product.basePrice)))}`
              : formatPrice(product.basePrice)
            }
          </p>
          {product.description && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-3 text-black">
                Description
              </h2>
              <p className="leading-relaxed text-gray-700 text-base">
                {product.description}
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-5 text-black">
                Options
              </h2>
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div 
                    key={variant.id}
                    className="p-5 border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-black">
                          {variant.name}
                        </h3>
                        {variant.sku && (
                          <p className="text-sm opacity-70 text-black">
                            SKU: {variant.sku}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-black">
                        {formatPrice(variant.price || product.basePrice)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-black">
                        Stock: {variant.stock > 0 ? `${variant.stock} available` : 'Out of stock'}
                      </p>
                      <AddToCartButton
                        productId={product.id}
                        variantId={variant.id}
                        disabled={variant.stock === 0}
                        accentColor={accentColor}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <AddToCartButton productId={product.id} accentColor={accentColor} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

