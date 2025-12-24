import { prisma } from './db'
import { ensureDatabaseInitialized } from './init-db'

let settingsCache: any = null
let cacheTime = 0
const CACHE_TTL = 60000 // 1 minute

export async function getStoreSettings() {
  try {
    // Ensure database is initialized on first access
    await ensureDatabaseInitialized()

    const now = Date.now()
    if (settingsCache && now - cacheTime < CACHE_TTL) {
      return settingsCache
    }

    let settings = await prisma.storeSettings.findFirst()
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {},
      })
    }

    settingsCache = settings
    cacheTime = now
    return settings
  } catch (error: any) {
    // Return default settings if database is not available
    console.error('Error fetching store settings:', error)
    return {
      id: 0,
      businessName: null,
      logoUrl: null,
      primaryColor: '#111827',
      secondaryColor: '#f3f4f6',
      businessEmail: null,
      businessPhone: null,
      businessAddress: null,
      businessCity: null,
      businessState: null,
      businessZip: null,
      businessCountry: null,
      aboutText: null,
      heroHeadline: null,
      heroSubheadline: null,
      heroImageUrl: null,
      openingHours: null,
      facebookUrl: null,
      instagramUrl: null,
      twitterUrl: null,
      tiktokUrl: null,
      stripeSecretKey: null,
      stripePublishableKey: null,
      showHomepage: true,
      showProductList: true,
      showSearch: true,
      showAccountArea: true,
      showContactPage: true,
      showLocationPage: true,
      showBlog: true,
      showFAQ: true,
      shippingMode: 'flat',
      flatShippingRateCents: 0,
      flatShippingLabel: 'Standard Shipping',
      updatedAt: new Date(),
    }
  }
}

export function clearSettingsCache() {
  settingsCache = null
  cacheTime = 0
}

