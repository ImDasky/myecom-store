import { getStoreSettings } from '@/lib/settings'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/AddToCartButton'
import { CategoryIcon } from '@/components/CategoryIcon'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const settings = await getStoreSettings()

  if (!settings.showProductList) {
    redirect('/')
  }

  const search = searchParams.search || ''
  const categorySlug = searchParams.category || ''
  
  // Get category if filtering by category (gracefully handle if table doesn't exist yet)
  let categoryId: number | undefined
  if (categorySlug) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      })
      categoryId = category?.id
    } catch (error: any) {
      // Category table might not exist yet if migrations haven't run
      console.warn('Categories table not available:', error.message)
    }
  }

  const where: any = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  // Get products and categories (gracefully handle if tables don't exist yet)
  let products: any[] = []
  let categories: any[] = []
  
  try {
    const [productsResult, categoriesResult] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { variants: { where: { isActive: true } }, category: true },
        orderBy: { createdAt: 'desc' },
      }).catch(() => []), // Gracefully handle if table doesn't exist yet
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      }).catch(() => []), // Gracefully handle if table doesn't exist yet
    ])
    products = productsResult || []
    categories = categoriesResult || []
  } catch (error: any) {
    // Tables might not exist yet if migrations haven't run
    console.warn('Products or categories table not available:', error.message)
    products = []
    categories = []
  }

  const primaryColor = settings.primaryColor || '#111827'
  const accentColor = settings.secondaryColor || '#2563eb'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-2 text-black">
          Products
        </h1>
        <p className="text-gray-600 text-lg mb-6">Browse our complete catalog</p>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/products"
              className={`px-5 py-2.5 rounded-lg border-2 font-semibold transition-all text-black ${
                !categorySlug
                  ? 'bg-gray-200 border-gray-400 shadow-sm'
                  : 'bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`px-5 py-2.5 rounded-lg border-2 font-semibold transition-all flex items-center gap-2 text-black ${
                  categorySlug === category.slug
                    ? 'bg-gray-200 border-gray-400 shadow-sm'
                    : 'bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <CategoryIcon iconName={category.icon} color="#111827" className="w-5 h-5" />
                {category.name}
              </Link>
            ))}
          </div>
        )}
        {settings.showSearch && (
          <form method="get" className="max-w-md">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={search}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 text-black placeholder-gray-400"
            />
          </form>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-black">
            No products found.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product) => {
            const images = product.images ? JSON.parse(product.images) : []
            const minPrice = product.variants.length > 0 && product.variants.some((v: any) => v.price)
              ? Math.min(...product.variants.filter((v: any) => v.price).map((v: any) => v.price!))
              : product.basePrice
            const maxPrice = product.variants.length > 0 && product.variants.some((v: any) => v.price)
              ? Math.max(...product.variants.filter((v: any) => v.price).map((v: any) => v.price!))
              : product.basePrice

            return (
              <div
                key={product.id}
                className="group border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-xs"
              >
                <Link href={`/products/${product.slug}`}>
                  {images[0] && (
                    <div className="aspect-square relative bg-gray-50 overflow-hidden">
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </Link>
                <div className="p-5 text-center">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-base mb-2 hover:underline text-black leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </Link>
                  <p className="font-bold text-xl mb-4 text-black">
                    {minPrice === maxPrice 
                      ? formatPrice(minPrice)
                      : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                    }
                  </p>
                  <div className="flex justify-center">
                    <AddToCartButton productId={product.id} accentColor={accentColor} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

