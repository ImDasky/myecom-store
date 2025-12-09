import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const { faqs } = await request.json()

    // Delete all existing FAQs
    await prisma.fAQ.deleteMany({})

    // Create new FAQs
    await prisma.fAQ.createMany({
      data: faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer,
        order: faq.order || 0,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('FAQ update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

