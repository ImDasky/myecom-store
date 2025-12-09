import { prisma } from './db'

let settingsCache: any = null
let cacheTime = 0
const CACHE_TTL = 60000 // 1 minute

export async function getStoreSettings() {
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
}

export function clearSettingsCache() {
  settingsCache = null
  cacheTime = 0
}

