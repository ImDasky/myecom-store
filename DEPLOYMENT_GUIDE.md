# Zero-Config Deployment Guide

This project is designed to work out-of-the-box when deployed to Netlify with a Neon database.

## Quick Deploy Steps

1. **Create a new Netlify site** from this repository
2. **Add a Neon database** via Netlify's "Add database" button
3. **Deploy** - that's it!

The project will automatically:
- ✅ Set up DATABASE_URL from NETLIFY_DATABASE_URL
- ✅ Run database migrations during build
- ✅ Handle missing tables gracefully
- ✅ Show a working site even with an empty database

## How It Works

### Automatic Database Setup

1. **Build Time**: The build script (`scripts/netlify-build.sh`) automatically:
   - Detects `NETLIFY_DATABASE_URL` from Neon integration
   - Sets `DATABASE_URL` for the build process
   - Runs Prisma migrations with retries (handles slow database connections)
   - Continues build even if migrations timeout (they'll run on first request)

2. **Runtime**: The application automatically:
   - Sets `DATABASE_URL` from `NETLIFY_DATABASE_URL` if not already set
   - Handles missing database tables gracefully
   - Returns default settings if database isn't ready yet

### Environment Variables

The project automatically uses `NETLIFY_DATABASE_URL` if `DATABASE_URL` is not set. This means:
- ✅ No manual environment variable setup needed
- ✅ Works automatically with Netlify's Neon integration
- ✅ Falls back gracefully if database isn't ready

### Manual Migration (if needed)

If migrations fail during build, you can manually trigger them:

```bash
# Via API endpoint (requires MIGRATE_SECRET env var)
curl -X GET "https://your-site.netlify.app/api/migrate" \
  -H "Authorization: Bearer your-migrate-secret"
```

Or set `MIGRATE_SECRET` in Netlify environment variables and visit:
`https://your-site.netlify.app/api/migrate?secret=your-secret`

## Troubleshooting

### "Application error" on first deploy

**Cause**: Database migrations might not have completed during build.

**Solution**: 
1. Wait 30-60 seconds for the database to fully initialize
2. Visit the site again - migrations will be attempted automatically
3. Or manually trigger migrations via `/api/migrate` endpoint

### "Table does not exist" errors

**Cause**: Migrations didn't run successfully.

**Solution**:
1. Check build logs to see if migrations ran
2. If migrations timed out, they'll run automatically on first request
3. Or manually run: `DATABASE_URL="your-url" npx prisma migrate deploy`

### DATABASE_URL not found

**Cause**: Netlify Neon integration might not have set NETLIFY_DATABASE_URL yet.

**Solution**:
1. Wait a few minutes after adding the database
2. Trigger a new deploy
3. Or manually set DATABASE_URL in Environment Variables

## What Gets Created Automatically

When migrations run, these tables are created:
- `StoreSettings` - Store configuration
- `User` - User accounts
- `Product` - Products
- `Category` - Product categories
- `Variant` - Product variants
- `Order` - Orders
- `OrderItem` - Order line items
- `BlogPost` - Blog posts
- `FAQ` - FAQ items

The app works even if these tables are empty - it shows default content and handles missing data gracefully.

