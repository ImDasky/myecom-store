import Stripe from 'stripe'
import { prisma } from './db'

export async function getStripeClient() {
  const settings = await prisma.storeSettings.findFirst()
  if (!settings?.stripeSecretKey) {
    throw new Error('Stripe secret key not configured. Please set it in admin settings.')
  }
  return new Stripe(settings.stripeSecretKey, {
    apiVersion: '2023-10-16',
  })
}

export async function getStripePublishableKey() {
  const settings = await prisma.storeSettings.findFirst()
  return settings?.stripePublishableKey || null
}

