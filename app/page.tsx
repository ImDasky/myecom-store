import { getStoreSettings } from '@/lib/settings'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getStoreSettings()

  if (!settings.showHomepage) {
    redirect('/products')
  }

  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { where: { isActive: true } } },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })

  const primaryColor = settings.primaryColor || '#111827'
  const secondaryColor = settings.secondaryColor || '#f3f4f6'

  return (
    <div>
      {/* Hero Section */}
      {settings.heroImageUrl && (
        <section 
          className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.heroImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white px-4">
            {settings.heroHeadline && (
              <h1 className="text-5xl font-bold mb-4">{settings.heroHeadline}</h1>
            )}
            {settings.heroSubheadline && (
              <p className="text-xl mb-8">{settings.heroSubheadline}</p>
            )}
            {settings.showProductList && (
              <Link
                href="/products"
                className="inline-block px-8 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: primaryColor, color: secondaryColor }}
              >
                Shop Now
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
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
          {settings.showProductList && (
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-block px-8 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: primaryColor, color: secondaryColor }}
              >
                View All Products
              </Link>
            </div>
          )}
        </section>
      )}

      {/* About Section */}
      {settings.aboutText && (
        <section 
          className="py-16"
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                About Us
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: primaryColor }}>
                {settings.aboutText}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Store Hours */}
      {settings.openingHours && (
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryColor }}>
              Store Hours
            </h2>
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: secondaryColor }}
            >
              <pre className="whitespace-pre-wrap font-sans" style={{ color: primaryColor }}>
                {settings.openingHours}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

