import { prisma } from './db'

let initChecked = false
let initInProgress = false
let tablesExist = false

/**
 * Ensure database is initialized - actually runs migrations if needed
 * This runs on first request if migrations didn't complete during build
 */
export async function ensureDatabaseInitialized(): Promise<boolean> {
  // Prevent multiple simultaneous initialization attempts
  if (initInProgress) {
    // Wait a bit and check again
    await new Promise(resolve => setTimeout(resolve, 1000))
    return tablesExist
  }

  // Only check once per process (unless we need to initialize)
  if (initChecked && tablesExist) {
    return true
  }

  try {
    // Try a simple query to check if tables exist
    await prisma.$queryRaw`SELECT 1 FROM "StoreSettings" LIMIT 1`
    tablesExist = true
    initChecked = true
    return true
  } catch (error: any) {
    // Table doesn't exist - need to run migrations
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      if (initInProgress) {
        return false
      }

      initInProgress = true
      initChecked = true

      try {
        console.log('Database tables not found. Running migrations...')
        
        // Use dynamic import to avoid circular dependencies
        const { exec } = await import('child_process')
        const { promisify } = await import('util')
        const execAsync = promisify(exec)

        // Try migrate deploy first
        try {
          const { stdout } = await execAsync('npx prisma migrate deploy', {
            env: { ...process.env },
            timeout: 30000,
            cwd: process.cwd(),
          })
          console.log('Migrations completed:', stdout)
          tablesExist = true
          initInProgress = false
          return true
        } catch (migrateError: any) {
          // If migrate deploy fails, try db push as fallback
          console.log('migrate deploy failed, trying db push...')
          const { stdout } = await execAsync('npx prisma db push --accept-data-loss', {
            env: { ...process.env },
            timeout: 30000,
            cwd: process.cwd(),
          })
          console.log('Database schema created with db push:', stdout)
          tablesExist = true
          initInProgress = false
          return true
        }
      } catch (migrationError: any) {
        console.error('Failed to initialize database:', migrationError.message)
        initInProgress = false
        return false
      }
    }
    
    // Some other database error
    console.error('Database connection error:', error.message)
    initChecked = true
    tablesExist = false
    return false
  }
}

