#!/bin/bash

# Database Setup Script for Neon
# Usage: ./setup-database.sh "your-connection-string"

if [ -z "$1" ]; then
  echo "Usage: ./setup-database.sh \"postgresql://user:password@host/dbname?sslmode=require\""
  echo ""
  echo "Get your connection string from:"
  echo "1. Netlify Dashboard → Site settings → Data → Neon database"
  echo "2. Or Neon Console: https://console.neon.tech"
  exit 1
fi

export DATABASE_URL="$1"

echo "🔧 Running database migrations..."
npx prisma migrate deploy

echo ""
echo "✅ Migrations complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create an admin user using Prisma Studio:"
echo "   DATABASE_URL=\"$1\" npx prisma studio"
echo ""
echo "2. Or generate a password hash:"
echo "   node -e \"const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));\""
echo ""
echo "3. Then add the user to the database with isAdmin: true"

