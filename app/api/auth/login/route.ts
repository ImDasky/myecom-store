import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create response with user data
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    })

    // Set session cookie - try multiple methods for compatibility
    try {
      // Method 1: Use cookies() helper (preferred for Next.js App Router)
      await createSession(user.id)
    } catch (cookieError: any) {
      console.error('Cookie helper failed, using direct method:', cookieError.message)
      try {
        // Method 2: Set cookie directly on response object
        response.cookies.set('session', user.id.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
      } catch (directError: any) {
        console.error('Direct cookie setting also failed:', directError.message)
        // If both fail, log but don't fail the request
        // The user can still use the app, just won't have a session cookie
      }
    }

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Error code:', error?.code)
    console.error('Error name:', error?.name)
    
    // Return more detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || 'Unknown error'
      : 'Internal server error'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error?.stack,
          code: error?.code 
        })
      },
      { status: 500 }
    )
  }
}

