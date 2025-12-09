# Database Setup Guide

## Quick Setup Steps

### 1. Create PostgreSQL Database

Choose one of these providers (all have free tiers):

**Option A: Supabase (Recommended)**
1. Go to https://supabase.com
2. Sign up and create a new project
3. Wait for project to initialize
4. Go to Settings → Database
5. Copy the "Connection string" under "Connection pooling" (use the `transaction` mode)
6. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**Option B: Railway**
1. Go to https://railway.app
2. Sign up and create new project
3. Click "New" → "Database" → "Add PostgreSQL"
4. Click on the PostgreSQL service
5. Go to "Variables" tab
6. Copy the `DATABASE_URL` value

**Option C: Neon**
1. Go to https://neon.tech
2. Sign up and create a project
3. Copy the connection string from the dashboard

### 2. Update Prisma Schema

The schema is currently set to SQLite. Update it to PostgreSQL:

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Add DATABASE_URL to Netlify

1. Go to your Netlify site dashboard
2. Site settings → Environment variables
3. Click "Add variable"
4. Key: `DATABASE_URL`
5. Value: Your PostgreSQL connection string
6. Click "Save"

### 4. Run Database Migrations

You need to run Prisma migrations to create the tables. You have a few options:

**Option A: Run locally pointing to production DB**
```bash
DATABASE_URL="your-production-connection-string" npx prisma migrate deploy
```

**Option B: Use Prisma Studio**
```bash
DATABASE_URL="your-production-connection-string" npx prisma studio
```
Then manually create tables or use the SQL editor.

**Option C: Use Supabase SQL Editor (if using Supabase)**
1. Go to Supabase dashboard → SQL Editor
2. Run the migration SQL (you can generate it with `npx prisma migrate dev --create-only`)

**Option D: Create a Netlify Function to run migrations**
Create a one-time function to initialize the database.

### 5. Create Admin User

After database is set up, create an admin user. You can do this via:

**Using Prisma Studio:**
```bash
DATABASE_URL="your-production-connection-string" npx prisma studio
```

Then:
1. Navigate to User table
2. Click "Add record"
3. Fill in:
   - email: your-admin-email@example.com
   - passwordHash: (generate bcrypt hash - see below)
   - isAdmin: true
   - createdAt: (current date)

**Generate password hash:**
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

Or use an online tool: https://bcrypt-generator.com/

### 6. Redeploy

After setting environment variables:
1. Go to Netlify dashboard
2. Deploys tab
3. Click "Trigger deploy" → "Clear cache and deploy site"

### 7. Verify

1. Visit: `https://your-site.netlify.app/api/health`
2. Should show: `{"status":"ok","database":"connected",...}`
3. Visit your site homepage - should load without errors
4. Log in with your admin account

## Troubleshooting

**Error: "DATABASE_URL not set"**
- Make sure you added it in Netlify environment variables
- Redeploy after adding

**Error: "Connection refused" or "Connection timeout"**
- Check your connection string is correct
- Make sure your database allows connections from Netlify IPs
- For Supabase: Use connection pooling URL

**Error: "Table does not exist"**
- Run migrations: `npx prisma migrate deploy`
- Or create tables manually

**Error: "Password authentication failed"**
- Double-check your connection string
- Make sure password is URL-encoded if it contains special characters

## Quick Test

After setup, test the health endpoint:
```bash
curl https://your-site.netlify.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "hasSettings": true,
  "timestamp": "2024-..."
}
```

