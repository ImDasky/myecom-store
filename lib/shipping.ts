import { prisma } from './db'

export interface ShippingCalculation {
  amountCents: number
  label: string
}

export async function calculateShipping(
  totalCents: number,
  shippingAddress?: any
): Promise<ShippingCalculation> {
  const settings = await prisma.storeSettings.findFirst()
  if (!settings) {
    return { amountCents: 0, label: 'Shipping' }
  }

  if (settings.shippingMode === 'stripe') {
    // Stripe will calculate shipping rates
    return { amountCents: 0, label: 'Shipping' }
  }

  // Flat rate shipping
  return {
    amountCents: settings.flatShippingRateCents || 0,
    label: settings.flatShippingLabel || 'Standard Shipping',
  }
}

