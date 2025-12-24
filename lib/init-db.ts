import { prisma } from './db'

let initChecked = false
let tablesExist = false

/**
 * Check if database tables exist
 * This is a lightweight check that doesn't throw errors
 */
export async function ensureDatabaseInitialized(): Promise<boolean> {
  // Only check once per process
  if (initChecked) {
    return tablesExist
  }

  initChecked = true

  try {
    // Try a simple query to check if tables exist
    await prisma.$queryRaw`SELECT 1 FROM "StoreSettings" LIMIT 1`
    tablesExist = true
    return true
  } catch (error: any) {
    // Table doesn't exist - this is OK, migrations should run during build
    // or can be run manually via /api/migrate endpoint
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.warn('Database tables not found. Migrations should run during build.')
      console.warn('If you see this in production, visit /api/migrate to initialize the database.')
      tablesExist = false
      return false
    }
    
    // Some other database error
    console.error('Database connection error:', error.message)
    tablesExist = false
    return false
  }
}

