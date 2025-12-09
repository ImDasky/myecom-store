import { getStoreSettings } from '@/lib/settings'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const settings = await getStoreSettings()

  if (!settings.showProductList) {
    redirect('/')
  }

  const search = searchParams.search || ''
  const where: any = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    }),
  }

  const products = await prisma.product.findMany({
    where,
    include: { variants: { where: { isActive: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: primaryColor }}>
          Products
        </h1>
        {settings.showSearch && (
          <form method="get" className="max-w-md">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={search}
              className="w-full px-4 py-2 border rounded-lg"
              style={{ 
                borderColor: primaryColor + '40',
                color: primaryColor,
              }}
            />
          </form>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: primaryColor }}>
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const images = product.images ? JSON.parse(product.images) : []
            const minPrice = product.variants.length > 0 && product.variants.some(v => v.price)
              ? Math.min(...product.variants.filter(v => v.price).map(v => v.price!))
              : product.basePrice
            const maxPrice = product.variants.length > 0 && product.variants.some(v => v.price)
              ? Math.max(...product.variants.filter(v => v.price).map(v => v.price!))
              : product.basePrice

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div 
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  style={{ borderColor: primaryColor + '20' }}
                >
                  {images[0] && (
                    <div className="aspect-square relative bg-gray-100">
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2" style={{ color: primaryColor }}>
                      {product.name}
                    </h3>
                    <p className="text-sm opacity-70 mb-2 line-clamp-2" style={{ color: primaryColor }}>
                      {product.description}
                    </p>
                    <p className="font-bold" style={{ color: primaryColor }}>
                      {minPrice === maxPrice 
                        ? formatPrice(minPrice)
                        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                      }
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

