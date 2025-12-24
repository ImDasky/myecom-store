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
  MAX_RETRIES=2
  RETRY_COUNT=0
  MIGRATION_SUCCESS=false
  USE_DB_PUSH=false
  
  while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Use timeout if available, otherwise just run directly
    MIGRATE_OUTPUT=""
    MIGRATE_EXIT=0
    if command -v timeout &> /dev/null; then
      timeout 60 npx prisma migrate deploy 2>&1 || MIGRATE_EXIT=$?
      MIGRATE_OUTPUT=$(timeout 60 npx prisma migrate deploy 2>&1) || MIGRATE_EXIT=$?
    else
      npx prisma migrate deploy 2>&1 || MIGRATE_EXIT=$?
      MIGRATE_OUTPUT=$(npx prisma migrate deploy 2>&1) || MIGRATE_EXIT=$?
    fi
    
    # Check if migration succeeded
    if [ $MIGRATE_EXIT -eq 0 ]; then
      MIGRATION_SUCCESS=true
      break
    fi
    
    # Check if it's a failed migration error (P3009) - skip retries and use db push
    if echo "$MIGRATE_OUTPUT" | grep -q "P3009\|failed migrations"; then
      echo "Detected failed migration state in database (P3009)"
      echo "Will use db push to bypass migration history and create schema directly"
      USE_DB_PUSH=true
      break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "Migration attempt $RETRY_COUNT failed, retrying in 5 seconds..."
      sleep 5
    fi
  done
  
  # If migrations fail OR if we detected failed migration state, use db push
  if [ "$MIGRATION_SUCCESS" = false ] || [ "$USE_DB_PUSH" = true ]; then
    if [ "$USE_DB_PUSH" = true ]; then
      echo "Using db push to bypass failed migration state..."
    else
      echo "Migrations failed, trying db push as fallback..."
    fi
    echo "db push will create schema directly from Prisma schema, bypassing migration history"
    if command -v timeout &> /dev/null; then
      if timeout 60 npx prisma db push --accept-data-loss --skip-generate; then
        echo "Database schema created using db push"
        MIGRATION_SUCCESS=true
      else
        echo "WARNING: db push failed"
        echo "Database will be initialized on first request"
      fi
    else
      if npx prisma db push --accept-data-loss --skip-generate; then
        echo "Database schema created using db push"
        MIGRATION_SUCCESS=true
      else
        echo "WARNING: db push failed"
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

