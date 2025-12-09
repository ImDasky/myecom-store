import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    const hasDbUrl = !!process.env.DATABASE_URL
    
    if (!hasDbUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL environment variable is not set',
        database: 'not configured'
      }, { status: 500 })
    }

    // Try to connect to database
    try {
      await prisma.$connect()
      const settings = await prisma.storeSettings.findFirst()
      
      return NextResponse.json({
        status: 'ok',
        database: 'connected',
        hasSettings: !!settings,
        timestamp: new Date().toISOString()
      })
    } catch (dbError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: dbError.message,
        database: 'connection failed'
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

