#!/bin/bash
# Don't use set -e so we can handle migration failures gracefully
set +e

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
  # First, try to run migrations (preferred method)
  echo "Running database migrations..."
  MAX_RETRIES=3
  RETRY_COUNT=0
  MIGRATION_SUCCESS=false
  
  while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Use timeout if available, otherwise just run directly
    if command -v timeout &> /dev/null; then
      if timeout 60 npx prisma migrate deploy; then
        MIGRATION_SUCCESS=true
        break
      fi
    else
      if npx prisma migrate deploy; then
        MIGRATION_SUCCESS=true
        break
      fi
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "Migration attempt $RETRY_COUNT failed, retrying in 5 seconds..."
      sleep 5
    fi
  done
  
  # If migrations fail, use db push as fallback (creates schema from Prisma schema)
  if [ "$MIGRATION_SUCCESS" = false ]; then
    echo "Migrations failed, trying db push as fallback..."
    if command -v timeout &> /dev/null; then
      if timeout 60 npx prisma db push --accept-data-loss; then
        echo "Database schema created using db push"
        MIGRATION_SUCCESS=true
      else
        echo "WARNING: Both migrate deploy and db push failed"
        echo "Database will be initialized on first request"
      fi
    else
      if npx prisma db push --accept-data-loss; then
        echo "Database schema created using db push"
        MIGRATION_SUCCESS=true
      else
        echo "WARNING: Both migrate deploy and db push failed"
        echo "Database will be initialized on first request"
      fi
    fi
  fi
else
  echo "WARNING: DATABASE_URL is not set or invalid. Skipping migrations."
  echo "DATABASE_URL preview: ${DATABASE_URL:0:30}..."
  echo "Database will be initialized on first request"
fi

# Build the application (use set -e here to fail build if build fails)
set -e
echo "Building application..."
npm run build

