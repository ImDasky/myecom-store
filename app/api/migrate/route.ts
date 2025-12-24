import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Simple auth check - allow secret in query param or header for easier use
  const authHeader = request.headers.get('authorization')
  const secretParam = request.nextUrl.searchParams.get('secret')
  const migrateSecret = process.env.MIGRATE_SECRET || 'migrate-secret'
  
  const isAuthorized = 
    authHeader === `Bearer ${migrateSecret}` || 
    secretParam === migrateSecret ||
    // Allow in development or if no secret is set (default)
    (!process.env.MIGRATE_SECRET && process.env.NODE_ENV !== 'production')
  
  if (!isAuthorized) {
    return NextResponse.json({ 
      error: 'Unauthorized',
      hint: 'Add ?secret=your-secret or Authorization: Bearer your-secret header'
    }, { status: 401 })
  }

  try {
    // Try migrate deploy first
    try {
      const cmd = './node_modules/.bin/prisma migrate deploy'
      const { stdout, stderr } = await execAsync(cmd, { timeout: 30000 })
      return NextResponse.json({
        success: true,
        method: 'migrate deploy',
        output: stdout,
        errors: stderr,
      })
    } catch (migrateError: any) {
      // If migrate deploy fails, try db push as fallback
      console.log('migrate deploy failed, trying db push...')
      const cmd = './node_modules/.bin/prisma db push --accept-data-loss'
      const { stdout, stderr } = await execAsync(cmd, { timeout: 30000 })
      return NextResponse.json({
        success: true,
        method: 'db push (fallback)',
        output: stdout,
        errors: stderr,
        migrateError: migrateError.message,
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        output: error.stdout,
        errors: error.stderr,
      },
      { status: 500 }
    )
  }
}

