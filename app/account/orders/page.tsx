import { getStoreSettings } from '@/lib/settings'
export const dynamic = 'force-dynamic'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function OrdersPage() {
  const settings = await getStoreSettings()

  if (!settings.showAccountArea) {
    redirect('/')
  }

  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  const primaryColor = settings.primaryColor || '#111827'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: primaryColor }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg mb-4">No orders yet.</p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">Order #{order.id}</p>
                  <p className="text-sm opacity-70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${(order.totalCents / 100).toFixed(2)}</p>
                  <p className={`text-sm ${
                    order.status === 'paid' ? 'text-green-600' :
                    order.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>${(item.unitPriceCents * item.quantity / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

