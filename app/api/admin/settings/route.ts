import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { clearSettingsCache } from '@/lib/settings'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const data = await request.json()

    await prisma.storeSettings.updateMany({
      data: {
        businessName: data.businessName || null,
        logoUrl: data.logoUrl || null,
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        businessEmail: data.businessEmail || null,
        businessPhone: data.businessPhone || null,
        businessAddress: data.businessAddress || null,
        businessCity: data.businessCity || null,
        businessState: data.businessState || null,
        businessZip: data.businessZip || null,
        businessCountry: data.businessCountry || null,
        aboutText: data.aboutText || null,
        heroHeadline: data.heroHeadline || null,
        heroSubheadline: data.heroSubheadline || null,
        heroImageUrl: data.heroImageUrl || null,
        openingHours: data.openingHours || null,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        twitterUrl: data.twitterUrl || null,
        tiktokUrl: data.tiktokUrl || null,
        showHomepage: data.showHomepage ?? true,
        showProductList: data.showProductList ?? true,
        showSearch: data.showSearch ?? true,
        showAccountArea: data.showAccountArea ?? true,
        showContactPage: data.showContactPage ?? true,
        showLocationPage: data.showLocationPage ?? true,
        showBlog: data.showBlog ?? true,
        showFAQ: data.showFAQ ?? true,
        shippingMode: data.shippingMode || 'flat',
        flatShippingRateCents: data.flatShippingRateCents || 0,
        flatShippingLabel: data.flatShippingLabel || null,
        stripeSecretKey: data.stripeSecretKey || null,
        stripePublishableKey: data.stripePublishableKey || null,
      },
    })

    clearSettingsCache()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

