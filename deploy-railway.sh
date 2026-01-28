#!/bin/bash
# Railway Deployment Script

echo "🚀 Deploying Vinberly Micro-Credit to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (opens browser)
echo "Please log in to Railway in your browser..."
railway login

# Initialize project
railway init

# Deploy
echo "Deploying application..."
railway up

echo "✅ Deployment complete!"
echo "Visit your deployed app at: $(railway url)"
