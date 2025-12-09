'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/orders/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data)
          setLoading(false)
          // Clear cart
          localStorage.removeItem('cart')
          window.dispatchEvent(new Event('cartUpdated'))
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. We&apos;ve received your order and will process it shortly.
          </p>
        </div>

        {order && (
          <div className="border rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Total:</strong> ${(order.totalCents / 100).toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          </div>
        )}

        <div className="space-x-4">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-50"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

