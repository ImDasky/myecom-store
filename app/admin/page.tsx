import { requireAdmin } from '@/lib/auth'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
  await requireAdmin()

  const [
    orderCount,
    pendingOrders,
    productCount,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      where: { status: 'pending' },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
    prisma.order.aggregate({
      where: { status: 'paid' },
      _sum: { totalCents: true },
    }),
  ])

  const revenue = totalRevenue._sum.totalCents || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">{formatPrice(revenue)}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Products</h3>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold">
            {pendingOrders.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="border rounded-lg">
            {pendingOrders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No pending orders</div>
            ) : (
              <div className="divide-y">
                {pendingOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.totalCents)}</p>
                        <p className="text-sm text-yellow-600">{order.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <div className="border rounded-lg p-6 space-y-4">
            <Link
              href="/admin/settings"
              className="block p-3 border rounded hover:bg-gray-50"
            >
              Store Settings
            </Link>
            <Link
              href="/admin/products"
              className="block p-3 border rounded hover:bg-gray-50"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="block p-3 border rounded hover:bg-gray-50"
            >
              View Orders
            </Link>
            <Link
              href="/admin/blog"
              className="block p-3 border rounded hover:bg-gray-50"
            >
              Manage Blog
            </Link>
            <Link
              href="/admin/faq"
              className="block p-3 border rounded hover:bg-gray-50"
            >
              Manage FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

