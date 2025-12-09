import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use NETLIFY_DATABASE_URL if DATABASE_URL is not set (for Netlify Neon integration)
// This ensures Prisma can find the database URL at runtime
// Must be set before PrismaClient is instantiated
const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL

if (databaseUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

