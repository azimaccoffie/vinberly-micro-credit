@echo off
REM Vinberly Micro-Credit Deployment Script for Windows

echo 🚀 Starting Vinberly Micro-Credit Deployment...

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed. Installing...
    npm install -g pnpm
)

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Build the application
echo 🔨 Building application...
pnpm build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    if "%1"=="vercel" (
        echo 🌐 Deploying to Vercel...
        vercel --prod
    ) else if "%1"=="render" (
        echo 🌐 Deploying to Render...
        echo Please create a new Web Service on Render and connect your repository
        echo Build command: pnpm install ^&^& pnpm build
        echo Start command: pnpm start
    ) else if "%1"=="railway" (
        echo 🌐 Deploying to Railway...
        railway up
    ) else if "%1"=="docker" (
        echo 🐳 Deploying with Docker...
        docker build -t vinberly-micro-credit .
        docker run -d -p 3000:3000 --env-file .env.production vinberly-micro-credit
    ) else (
        echo 📋 Deployment options:
        echo   deploy.bat vercel    - Deploy to Vercel
        echo   deploy.bat render    - Instructions for Render
        echo   deploy.bat railway   - Deploy to Railway
        echo   deploy.bat docker    - Deploy with Docker
        echo.
        echo 📝 Don't forget to:
        echo   1. Update .env.production with your values
        echo   2. Configure OAuth credentials
        echo   3. Set up database if needed
    )
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)
