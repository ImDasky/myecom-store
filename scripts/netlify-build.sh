#!/bin/bash
set -e

# Debug: Show environment variables (without exposing full values)
echo "Checking environment variables..."
echo "DATABASE_URL is set: $([ -n "$DATABASE_URL" ] && echo 'yes' || echo 'no')"
echo "NETLIFY_DATABASE_URL is set: $([ -n "$NETLIFY_DATABASE_URL" ] && echo 'yes' || echo 'no')"

# Ensure DATABASE_URL is set from NETLIFY_DATABASE_URL
# Check if DATABASE_URL is empty or just the literal string "$NETLIFY_DATABASE_URL"
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "\$NETLIFY_DATABASE_URL" ] || [ "$DATABASE_URL" = '$NETLIFY_DATABASE_URL' ]; then
  if [ -n "$NETLIFY_DATABASE_URL" ]; then
    export DATABASE_URL="$NETLIFY_DATABASE_URL"
    echo "Set DATABASE_URL from NETLIFY_DATABASE_URL"
  else
    echo "WARNING: Neither DATABASE_URL nor NETLIFY_DATABASE_URL is set. Skipping migrations."
    echo "Migrations can be run manually via API endpoint /api/migrate after deployment"
  fi
fi

# Verify DATABASE_URL starts with postgresql:// or postgres://
if [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" =~ ^postgresql:// ]] || [[ "$DATABASE_URL" =~ ^postgres:// ]]; then
  # Run migrations with retries (database might be slow to connect)
  echo "Running database migrations..."
  MAX_RETRIES=3
  RETRY_COUNT=0
  MIGRATION_SUCCESS=false
  
  while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if npx prisma migrate deploy; then
      MIGRATION_SUCCESS=true
      break
    else
      RETRY_COUNT=$((RETRY_COUNT + 1))
      if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo "Migration attempt $RETRY_COUNT failed, retrying in 5 seconds..."
        sleep 5
      fi
    fi
  done
  
  if [ "$MIGRATION_SUCCESS" = false ]; then
    echo "WARNING: Migration failed after $MAX_RETRIES attempts, but continuing with build..."
    echo "Migrations will be attempted automatically on first request"
  fi
else
  echo "WARNING: DATABASE_URL is not set or invalid. Skipping migrations."
  echo "DATABASE_URL preview: ${DATABASE_URL:0:30}..."
  echo "Migrations will be attempted automatically on first request"
fi

# Build the application
echo "Building application..."
npm run build

