import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
  const hasDbUrl = !!dbUrl
  const dbUrlPreview = hasDbUrl && dbUrl
    ? dbUrl.substring(0, 30) + '...' 
    : 'NOT SET'
  
  return NextResponse.json({
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    NETLIFY_DATABASE_URL_set: !!process.env.NETLIFY_DATABASE_URL,
    NETLIFY_DATABASE_URL_UNPOOLED_set: !!process.env.NETLIFY_DATABASE_URL_UNPOOLED,
    using_url: dbUrl ? dbUrl.substring(0, 30) + '...' : 'NONE',
    all_env_keys: Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || key.includes('DB') || key.includes('NEON')
    ),
    node_env: process.env.NODE_ENV,
  })
}

