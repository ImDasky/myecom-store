# Cloudflare Pages Configuration

## Build Settings

In your Cloudflare Pages dashboard, configure:

- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (or leave empty)
- **Deploy command**: (leave empty - Cloudflare Pages handles deployment automatically)

## Environment Variables

Set these in Cloudflare Pages → Settings → Environment variables:

- `DATABASE_URL` - Your PostgreSQL database connection string
- `NODE_ENV` - Set to `production`
- `NEXT_PUBLIC_APP_URL` - Your Cloudflare Pages URL (e.g., `https://your-site.pages.dev`)

## Important Notes

1. **No deploy command needed** - Cloudflare Pages automatically deploys the build output
2. **Do NOT use wrangler deploy** - That's for Cloudflare Workers, not Pages
3. The build output (`.next` folder) is automatically deployed by Cloudflare Pages

## Database Migrations

Database migrations will run automatically on first request via the `initDb` function, or you can trigger them manually via the `/api/migrate` endpoint.

