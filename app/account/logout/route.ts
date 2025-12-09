import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  await clearSession()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return NextResponse.redirect(new URL('/auth/login', baseUrl))
}

