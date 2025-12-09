# Fix DATABASE_URL Not Found Error

## The Problem
Netlify's Neon integration shows DATABASE_URL in the deploy contexts, but the runtime functions can't access it. This is a known issue - we need to manually add it to Environment Variables.

## Solution: Manually Add DATABASE_URL

### Step 1: Get Your Connection String
You already have it:
```
postgresql://neondb_owner:npg_3GKmSDdcF2HP@ep-dry-sea-aebk9n8o-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### Step 2: Add to Netlify Environment Variables

1. Go to **Netlify Dashboard** → Your site
2. Click **Site settings**
3. Click **Environment variables** (in the left sidebar)
4. Click **"Add variable"**
5. Fill in:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_3GKmSDdcF2HP@ep-dry-sea-aebk9n8o-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require`
   - **Scopes:** Select **"All scopes"** (or at minimum: Production, Deploy Previews, Branch deploys)
6. Click **"Save"**

### Step 3: Redeploy

After adding the environment variable:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

OR just push a commit to trigger auto-deploy:
```bash
git commit --allow-empty -m "Trigger redeploy after DATABASE_URL fix"
git push
```

### Step 4: Verify

After redeploy, check:
1. Visit: `https://your-site.netlify.app/api/health`
2. Should return: `{"status":"ok","database":"connected",...}`
3. Visit your homepage - should load without errors

## Why This Happens

Netlify's Neon integration sets DATABASE_URL for the build process, but runtime functions (serverless functions) need environment variables to be explicitly set in the Environment Variables section. This is a Netlify architecture requirement.

## Alternative: Use Netlify CLI

If you prefer using CLI:

```bash
netlify env:set DATABASE_URL "postgresql://neondb_owner:npg_3GKmSDdcF2HP@ep-dry-sea-aebk9n8o-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

Then redeploy.

