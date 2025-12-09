#!/bin/bash

# Netlify Deployment Script
# This script helps deploy the site to Netlify

echo "🚀 Starting Netlify Deployment..."

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Install it with: npm install -g netlify-cli"
    exit 1
fi

# Check if logged in
if ! netlify status &> /dev/null; then
    echo "📝 Please login to Netlify first:"
    echo "   netlify login"
    exit 1
fi

echo "✅ Netlify CLI is ready"
echo ""
echo "📋 Next steps:"
echo "1. Run: netlify init"
echo "   - Select 'Yes, create and deploy site manually'"
echo "   - Choose your team"
echo ""
echo "2. Set environment variables:"
echo "   netlify env:set DATABASE_URL 'your-database-url'"
echo "   netlify env:set AUTH_SECRET 'your-random-secret'"
echo "   netlify env:set NEXT_PUBLIC_APP_URL 'https://your-site.netlify.app'"
echo ""
echo "3. Deploy:"
echo "   netlify deploy --prod"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"

