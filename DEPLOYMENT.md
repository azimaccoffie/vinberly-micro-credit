# Vinberly Micro-Credit Deployment Guide

## Deployment Options

This application can be deployed using several methods:

### 1. Vercel (Frontend Only)
Since this is a React/Vite application with a Node.js backend, you can deploy:
- Frontend to Vercel/Netlify
- Backend to a Node.js hosting provider

### 2. Render/Railway (Full Stack)
Deploy the entire application as a single service.

### 3. Docker Deployment
Use the provided Dockerfile for containerized deployment.

## Prerequisites

1. Update `.env.production` with your actual values
2. Ensure you have a database (MySQL) ready if needed
3. Configure OAuth credentials

## Deployment Steps

### Option 1: Vercel + Railway

1. **Frontend Deployment (Vercel):**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Build frontend
   pnpm build
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Backend Deployment (Railway):**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Initialize Railway project
   railway init
   
   # Deploy
   railway up
   ```

### Option 2: Render (Full Stack)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pnpm install && pnpm build`
4. Set start command: `pnpm start`
5. Add environment variables from `.env.production`

### Option 3: Docker Deployment

```bash
# Build the image
docker build -t vinberly-micro-credit .

# Run the container
docker run -p 3000:3000 --env-file .env.production vinberly-micro-credit
```

## Environment Variables Required

- `NODE_ENV`: production
- `PORT`: 3000
- `COOKIE_SECRET`: Secure random string
- `VITE_APP_ID`: Your Manus app ID
- `OAUTH_SERVER_URL`: OAuth server URL
- `DATABASE_URL`: MySQL connection string (optional)

## Post-Deployment Checklist

- [ ] Update environment variables
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Test all major features
- [ ] Set up monitoring/logging
- [ ] Configure custom domain
- [ ] Set up SSL certificate

## Support

For deployment issues, check:
- Application logs
- Environment variable configuration
- Network/firewall settings
- Database connectivity
