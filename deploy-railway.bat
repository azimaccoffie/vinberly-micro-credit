@echo off
REM Railway Deployment Script for Windows

echo 🚀 Deploying Vinberly Micro-Credit to Railway...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Railway CLI...
    npm install -g @railway/cli
)

REM Login to Railway
echo Please log in to Railway in your browser when prompted...
railway login

REM Initialize project
railway init

REM Deploy
echo Deploying application...
railway up

echo ✅ Deployment complete!
for /f %%i in ('railway url') do set APP_URL=%%i
echo Visit your deployed app at: %APP_URL%

pause