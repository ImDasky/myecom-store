import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Create the first admin user (only works if no admin users exist)
 * This is a one-time setup endpoint for fresh deployments
 * 
 * GET: Shows instructions or creates admin via query params
 * POST: Creates admin via JSON body
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  const password = request.nextUrl.searchParams.get('password')

  // If email and password are provided, try to create admin
  if (email && password) {
    return await createAdminUser(email, password)
  }

  // Otherwise show instructions
  return NextResponse.json({
    message: 'Setup Admin Endpoint',
    instructions: {
      method1: 'Use POST with JSON body: { "email": "admin@example.com", "password": "your-password" }',
      method2: 'Use GET with query params: ?email=admin@example.com&password=your-password',
      curlExample: 'curl -X POST "https://your-site.netlify.app/api/setup-admin" -H "Content-Type: application/json" -d \'{"email":"admin@example.com","password":"your-password"}\'',
      note: 'This endpoint only works if no admin users exist yet (security feature)'
    }
  }, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    return await createAdminUser(email, password)
  } catch (error: any) {
    console.error('Setup admin error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createAdminUser(email: string, password: string) {
  try {
    // Check if any admin users already exist
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists. Please log in or use create-admin.js script.' },
        { status: 400 }
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user with this email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isAdmin: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error: any) {
    console.error('Create admin user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

