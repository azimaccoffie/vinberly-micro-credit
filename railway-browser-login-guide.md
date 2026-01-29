# Railway Browser Login Quick Reference

## 🎯 Exact Steps for Browser Login

### 1. Railway Login
- URL: https://railway.app
- Click: "Sign In" → "Continue with GitHub"

### 2. GitHub Authorization
- Authorize Railway app
- Grant repository access permissions

### 3. Project Creation
- Click: "New Project"
- Select: "Deploy from GitHub repo"
- Choose: azimaccoffie/vinberly-micro-credit

### 4. Configuration Settings
Build Command: pnpm install && pnpm build
Start Command: pnpm start
Root Directory: (leave empty)

### 5. Environment Variables
NODE_ENV=production
PORT=10000
COOKIE_SECRET=5dc337654081ee8d2369af13e7d011b2631dd7eb76c7c5fbea8135215b4e7223
VITE_APP_ID=demo-app
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

### 6. Deployment
- Click: "Deploy"
- Wait: 3-5 minutes
- Visit: https://[your-project].up.railway.app

## 🎯 Troubleshooting
- If GitHub asks for permissions: Grant all requested access
- If Railway shows "No repositories": Refresh the page
- If build fails: Double-check build/start commands exactly