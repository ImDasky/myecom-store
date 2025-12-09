# Setting Up Neon Database with Netlify

## Step 1: Get Your Neon Connection String

1. Go to your **Netlify Dashboard**
2. Click on your site
3. Go to **Site settings** → **Data** (or look for "Neon" in the sidebar)
4. You should see your Neon database listed
5. Click on it or look for "Connection string" or "Connection details"
6. Copy the connection string (it will look like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

**Alternative:** If you can't find it in Netlify:
1. Go directly to [Neon Console](https://console.neon.tech)
2. Sign in (use the same account if linked)
3. Find your project
4. Go to the project dashboard
5. Click on "Connection Details" or "Connection String"
6. Copy the connection string

## Step 2: Add DATABASE_URL to Netlify Environment Variables

1. In **Netlify Dashboard** → Your site
2. Go to **Site settings** → **Environment variables**
3. Click **"Add variable"**
4. **Key:** `DATABASE_URL`
5. **Value:** Paste your Neon connection string
6. **Scopes:** Select "All scopes" (or at least "Production")
7. Click **"Save"**

## Step 3: Update Prisma Schema (Already Done)

The schema has been updated to use PostgreSQL. The change is in the repository.

## Step 4: Run Database Migrations

You need to create the database tables. Here are your options:

### Option A: Run Migrations Locally (Easiest)

1. Make sure you have the latest code:
   ```bash
   git pull
   ```

2. Run migrations pointing to your Neon database:
   ```bash
   DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
   ```

   Replace `your-neon-connection-string` with the actual connection string from Step 1.

### Option B: Use Prisma Studio to Initialize

1. Open Prisma Studio:
   ```bash
   DATABASE_URL="your-neon-connection-string" npx prisma studio
   ```

2. This will open a browser interface. The tables will be created automatically when you first access them.

### Option C: Generate and Run Migration SQL

1. Generate migration SQL:
   ```bash
   DATABASE_URL="your-neon-connection-string" npx prisma migrate dev --create-only --name init
   ```

2. This creates a migration file in `prisma/migrations/`

3. Apply it:
   ```bash
   DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
   ```

## Step 5: Create Admin User

After migrations are complete, create your admin user:

### Using Prisma Studio:

1. Open Prisma Studio:
   ```bash
   DATABASE_URL="your-neon-connection-string" npx prisma studio
   ```

2. Navigate to the **User** table
3. Click **"Add record"**
4. Fill in:
   - **email:** your-admin-email@example.com
   - **passwordHash:** (see below to generate)
   - **isAdmin:** `true` (check the checkbox)
   - **createdAt:** (leave as default or set to current date)

5. Click **"Save 1 change"**

### Generate Password Hash:

**Option 1: Using Node.js**
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

**Option 2: Online Tool**
- Go to https://bcrypt-generator.com/
- Enter your password
- Set rounds to 10
- Copy the hash

**Option 3: Create a temporary script**
Create a file `hash-password.js`:
```javascript
const bcrypt = require('bcryptjs');
const password = process.argv[2];
if (!password) {
  console.error('Usage: node hash-password.js <password>');
  process.exit(1);
}
console.log(bcrypt.hashSync(password, 10));
```

Then run:
```bash
node hash-password.js your-password
```

## Step 6: Redeploy Netlify Site

1. Go to **Netlify Dashboard** → Your site
2. Go to **Deploys** tab
3. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

Or just push a commit:
```bash
git add .
git commit -m "Update to PostgreSQL"
git push
```

## Step 7: Verify Everything Works

1. **Check health endpoint:**
   Visit: `https://your-site.netlify.app/api/health`
   
   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "hasSettings": true,
     "timestamp": "..."
   }
   ```

2. **Visit your site:**
   Should load without errors

3. **Log in as admin:**
   - Go to `/auth/login`
   - Use the email and password you created
   - Should redirect to `/admin`

## Troubleshooting

**"DATABASE_URL not set" error:**
- Make sure you added it in Netlify environment variables
- Make sure you selected the right scope (Production)
- Redeploy after adding

**"Connection refused" or "Connection timeout":**
- Check your connection string is correct
- Make sure it includes `?sslmode=require` at the end
- Try the connection string in a database client to verify it works

**"Table does not exist":**
- Run migrations: `npx prisma migrate deploy`
- Check that migrations completed successfully

**"Password authentication failed":**
- Double-check your connection string
- Make sure password is correct (it might be URL-encoded in the connection string)

## Quick Command Reference

```bash
# Get connection string from Netlify dashboard and set it
export DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio to manage data
npx prisma studio

# Generate password hash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

