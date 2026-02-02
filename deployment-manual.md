# Vinberly Micro-Credit Deployment Instructions

## 🎯 Manual Railway Deployment (Web Interface - Recommended)

### Step 1: GitHub Repository
Your repository is already available at: https://github.com/azimaccoffie/vinberly-micro-credit

### Step 2: Railway Configuration
1. Visit https://railway.app
2. Sign in with GitHub manually
3. Create new project
4. Connect to GitHub repository: `azimaccoffie/vinberly-micro-credit`

### Step 3: Build and Start Configuration
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Root Directory**: Leave empty
- **Node Version**: 18+ (auto-detected)

### Step 4: Environment Variables (IMPORTANT!)
Add these exact environment variables in Railway:
```
NODE_ENV=production
PORT=10000
COOKIE_SECRET=5dc337654081ee8d2369af13e7d011b2631dd7eb76c7c5fbea8135215b4e7223
VITE_APP_ID=demo-app
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

### Step 5: Deploy and Verify
- Click Deploy (3-5 minutes)
- Test all features: login, blog, marketplace
- Visit your live URL: https://[project-name].up.railway.app

## 🎯 Expected Issues and Quick Fixes

### Common Errors:
1. **"Missing pnpm"** - Add to your repository
2. **"PORT not found"** - Check PORT environment variable
3. **Authentication not working** - Verify COOKIE_SECRET

### Testing Live Site:
- Demo login button should work
- All pages should load (no 404 errors)
- Blog and marketplace functional

## 🎯 Emergency Deployment Info
Repository: https://github.com/azimaccoffie/vinberly-micro-credit  
Railway Project: https://railway.app/project/new