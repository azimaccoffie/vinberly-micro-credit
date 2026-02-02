# Vinberly Micro-Credit Platform

A modern micro-credit platform for small business owners in Accra, Ghana.

## Features

- **Loan Application**: Easy online loan application process
- **Dashboard**: Customer and admin dashboards
- **Marketplace**: Partner services marketplace
- **Blog**: Educational content for entrepreneurs
- **Support**: AI-powered customer support
- **Authentication**: Secure OAuth integration

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, tRPC
- **Database**: MySQL (Drizzle ORM)
- **Authentication**: Manus OAuth
- **Deployment**: Docker-ready, Vercel/Railway compatible

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Visit http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

### Option 1: Vercel + Railway (Recommended)

1. **Frontend (Vercel)**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Backend (Railway)**:
   ```bash
   npm install -g @railway/cli
   railway init
   railway up
   ```

### Option 2: Render (Full Stack)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pnpm install && pnpm build`
4. Set start command: `pnpm start`
5. Add environment variables

### Option 3: Docker

```bash
# Build and run with Docker
docker-compose up -d

# Or build manually
docker build -t vinberly-micro-credit .
docker run -p 3000:3000 --env-file .env.production vinberly-micro-credit
```

## Environment Variables

Create a `.env.production` file with:

```env
# Application
NODE_ENV=production
PORT=3000

# Manus OAuth
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Security
COOKIE_SECRET=your-secure-cookie-secret

# Database (optional)
DATABASE_URL=mysql://user:pass@host:port/dbname
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared types and constants
├── drizzle/         # Database schema
├── dist/            # Built files (generated)
└── DEPLOYMENT.md    # Detailed deployment guide
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier

## Deployment Scripts

- `deploy.sh` - Unix/Linux deployment script
- `deploy.bat` - Windows deployment script

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT

## Support

For deployment issues, refer to [DEPLOYMENT.md](DEPLOYMENT.md) or contact support.
