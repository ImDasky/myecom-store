# Verify DATABASE_URL is Set Correctly

## Step 1: Check if Environment Variable is Accessible

After you've added DATABASE_URL to Netlify Environment Variables and redeployed, test it:

Visit: `https://your-site.netlify.app/api/test-env`

This will show:
- Whether DATABASE_URL is set
- A preview of the connection string (first 30 chars)
- All environment variables containing "DATABASE", "DB", or "NEON"

## Step 2: Manual Verification in Netlify Dashboard

1. Go to **Netlify Dashboard** → Your site
2. **Site settings** → **Environment variables**
3. Verify `DATABASE_URL` is listed there
4. Check the **Scopes** - make sure it includes:
   - ✅ Production
   - ✅ Deploy Previews  
   - ✅ Branch deploys
   - ✅ Preview Server & Agent Runners

## Step 3: If Still Not Working

### Option A: Use Netlify CLI to Set It

```bash
netlify env:set DATABASE_URL "postgresql://neondb_owner:npg_3GKmSDdcF2HP@ep-dry-sea-aebk9n8o-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

Then redeploy.

### Option B: Check Netlify Function Logs

1. Go to **Functions** tab in Netlify
2. Check if there are any function invocations
3. Look at the logs to see what environment variables are available

### Option C: Use Netlify's Built-in Neon Integration

Since you used Netlify's "Add database" button, the connection string might be available under a different name. Check:

1. **Site settings** → **Data** → Your Neon database
2. Look for "Connection string" or "Environment variable name"
3. It might be named something like `NEON_DATABASE_URL` instead of `DATABASE_URL`

If so, you have two options:
- Rename it to `DATABASE_URL` in Environment Variables
- Or update the code to use the actual variable name

## Step 4: Force Redeploy

After making changes:

1. **Deploys** tab
2. **Trigger deploy** → **Clear cache and deploy site**

This ensures a fresh build with the latest environment variables.

## Common Issues

**Issue:** Variable shows in dashboard but not accessible in functions
- **Solution:** Make sure scopes include all deploy contexts
- **Solution:** Redeploy after adding/updating

**Issue:** Variable works in build but not in runtime
- **Solution:** This is expected - runtime functions need explicit env vars
- **Solution:** Make sure it's in Environment Variables, not just build settings

**Issue:** Variable name mismatch
- **Solution:** Check if Neon integration uses a different name
- **Solution:** Use `/api/test-env` to see what's actually available

