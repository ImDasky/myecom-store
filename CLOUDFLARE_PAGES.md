# Cloudflare Pages Deployment Guide

## Issue: Deploy Command Error

The error `Missing entry-point to Worker script` occurs because Cloudflare Pages is trying to run `npx wrangler deploy`, which is for Cloudflare Workers, not Pages.

## Solution: Remove Deploy Command

In your Cloudflare Pages dashboard:

1. Go to **Settings** → **Builds & deployments**
2. Find the **Deploy command** field
3. **Clear it** or leave it **empty**
4. Cloudflare Pages will automatically deploy your build output

## Build Configuration

Set these in Cloudflare Pages:

- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (or leave empty)
- **Deploy command**: (leave empty - Cloudflare Pages handles this automatically)

## Environment Variables

Set in Cloudflare Pages → Settings → Environment variables:

- `DATABASE_URL` - Your PostgreSQL database connection string
- `NODE_ENV` - `production`
- `NEXT_PUBLIC_APP_URL` - Your Cloudflare Pages URL

## Important Notes

- **Do NOT use wrangler deploy** - That's for Workers, not Pages
- Cloudflare Pages automatically deploys the `.next` build output
- No custom deploy command needed

