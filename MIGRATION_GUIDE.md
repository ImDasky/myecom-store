# Database Migration Guide

## Adding Category Support

To add category support to your database, you need to run a Prisma migration.

### Steps:

1. **Generate the migration:**
   ```bash
   npx prisma migrate dev --name add_categories
   ```

2. **For production (Netlify):**
   - The migration will run automatically on the next deployment if you have `prisma migrate deploy` in your build script
   - Or manually run: `npx prisma migrate deploy`

### What the migration does:

- Creates a new `Category` table with fields:
  - `id` (primary key)
  - `name` (category name)
  - `slug` (URL-friendly identifier)
  - `description` (optional)
  - `icon` (emoji icon)
  - `order` (display order)
  - `isActive` (active status)
  - `createdAt`, `updatedAt` (timestamps)

- Adds `categoryId` field to `Product` table (optional foreign key to `Category`)

### After Migration:

1. Go to `/admin/categories` to create your first categories
2. Edit products to assign them to categories
3. Categories will appear in:
   - Header navigation dropdown
   - Homepage "Shop by Product Group" section
   - Products page filter buttons
   - Footer shop links

