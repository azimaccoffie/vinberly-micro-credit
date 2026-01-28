#!/bin/bash

# Vinberly Micro-Credit Deployment Script

echo "🚀 Starting Vinberly Micro-Credit Deployment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the application
echo "🔨 Building application..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check deployment target
    if [ "$1" == "vercel" ]; then
        echo "🌐 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        
    elif [ "$1" == "render" ]; then
        echo "🌐 Deploying to Render..."
        echo "Please create a new Web Service on Render and connect your repository"
        echo "Build command: pnpm install && pnpm build"
        echo "Start command: pnpm start"
        
    elif [ "$1" == "railway" ]; then
        echo "🌐 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        railway init
        railway up
        
    elif [ "$1" == "docker" ]; then
        echo "🐳 Deploying with Docker..."
        docker build -t vinberly-micro-credit .
        docker run -d -p 3000:3000 --env-file .env.production vinberly-micro-credit
        
    else
        echo "📋 Deployment options:"
        echo "  ./deploy.sh vercel    - Deploy to Vercel"
        echo "  ./deploy.sh render    - Instructions for Render"
        echo "  ./deploy.sh railway   - Deploy to Railway"
        echo "  ./deploy.sh docker    - Deploy with Docker"
        echo ""
        echo "📝 Don't forget to:"
        echo "  1. Update .env.production with your values"
        echo "  2. Configure OAuth credentials"
        echo "  3. Set up database if needed"
    fi
    
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
