import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { cookies } from 'next/headers'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number) {
  try {
    const cookieStore = await cookies()
    cookieStore.set('session', userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  } catch (error: any) {
    // In some serverless environments, cookies() might throw
    // Log but don't fail - the response will still be returned
    console.error('Error setting session cookie:', error.message)
    throw error // Re-throw so caller knows it failed
  }
}

export async function getSession(): Promise<number | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  if (!session) return null
  return parseInt(session.value, 10)
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getCurrentUser() {
  const userId = await getSession()
  if (!userId) return null
  return prisma.user.findUnique({ where: { id: userId } })
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || !user.isAdmin) {
    throw new Error('Unauthorized')
  }
  return user
}

