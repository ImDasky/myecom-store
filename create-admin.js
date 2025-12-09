const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3GKmSDdcF2HP@ep-dry-sea-aebk9n8o-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
})

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com'
  const password = process.argv[3] || 'admin123'
  
  if (!email || !password) {
    console.error('Usage: node create-admin.js <email> <password>')
    process.exit(1)
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isAdmin: true,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${user.email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Is Admin: ${user.isAdmin}`)
    console.log('\n📝 You can now log in at: /auth/login')
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Error: User with this email already exists')
    } else {
      console.error('❌ Error creating admin user:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

