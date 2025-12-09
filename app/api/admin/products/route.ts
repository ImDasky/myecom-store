import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const data = await request.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        basePrice: data.basePrice,
        images: data.images,
        categoryId: data.categoryId || null,
        isActive: data.isActive ?? true,
        variants: {
          create: data.variants.map((v: any) => ({
            name: v.name,
            sku: v.sku || null,
            price: v.price || null,
            stock: v.stock || 0,
            isActive: v.isActive ?? true,
          })),
        },
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

