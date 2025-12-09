'use client'

import { useState } from 'react'

interface AddToCartButtonProps {
  productId: number
  variantId?: number
  disabled?: boolean
}

export function AddToCartButton({ productId, variantId, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const addToCart = () => {
    if (disabled || adding) return

    setAdding(true)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    const existingIndex = cart.findIndex(
      (item: any) => item.productId === productId && item.variantId === variantId
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({ productId, variantId, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Dispatch custom event for cart button update
    window.dispatchEvent(new Event('cartUpdated'))
    
    setAdding(false)
    setQuantity(1)
    
    // Show feedback
    alert('Added to cart!')
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-16 px-2 py-1 border rounded text-center"
        disabled={disabled}
      />
      <button
        onClick={addToCart}
        disabled={disabled || adding}
        className="px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: disabled ? '#ccc' : '#111827',
          color: '#fff',
        }}
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}

