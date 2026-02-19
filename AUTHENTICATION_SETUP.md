# Authentication and Admin Setup Guide

## 🔐 Enabling Real User Authentication

Your application is already configured to handle real user authentication through the Manus OAuth system. Here's how it works:

### 1. Real User Registration Flow:
1. User clicks "Sign In" button
2. Redirected to OAuth portal: https://oauth.manus.im
3. User authenticates with their OAuth provider
4. OAuth callback creates user in database with role "user" by default
5. Session token is created and stored in cookies

### 2. Admin User Setup:
To make a user an admin, you need to set the OWNER_OPEN_ID environment variable or update the user's role directly in the database.

## 🛠️ Setting Up Admin User

### Option 1: Set Owner OpenID (Recommended)
Add this environment variable in Render:
```
OWNER_OPEN_ID=your_real_oauth_openid
```

This will automatically assign admin role to the specified user.

### Option 2: Manual Database Update
If you want to promote an existing user to admin:

1. After a user registers via OAuth, you can update their role in the database:
   - If using a real database: Update the `users` table, set `role='admin'` for the desired user
   - If using in-memory storage (default): The system uses OWNER_OPEN_ID to determine admin status

## 🎯 Admin Controls Currently Active

Your system already has admin-protected endpoints:

### Loan Management (Admin Only):
- `loanApplication.getAll` - View all loan applications
- `loanApplication.updateStatus` - Update loan application status

### Blog Management (Admin Only):
- `blog.create` - Create new blog posts

### Compliance Reports (Admin Only):
- `compliance.generateMonthly` - Generate monthly reports
- `compliance.generateQuarterly` - Generate quarterly reports
- `compliance.generateAnnual` - Generate annual reports

### AI Chatbot Analytics (Admin Only):
- `ai.analytics` - View chatbot usage analytics

### Blockchain Tokenization (Admin Only):
- `blockchain.getAnalytics` - View tokenization analytics
- `blockchain.createPool` - Create loan pools for tokenization
- `marketplace.getStats` - View marketplace statistics

## 🔐 OAuth Configuration

Your OAuth is configured correctly:
- OAuth Server: https://oauth.manus.im
- App ID: demo-app (or your configured VITE_APP_ID)
- Callback URL: /api/oauth/callback

## 🧪 Testing Authentication

### For Registered Users:
1. Click the login button (uses real OAuth flow)
2. Complete authentication at oauth.manus.im
3. Return to application with valid session

### For Admin Functions:
1. Log in as admin user (either with OWNER_OPEN_ID set, or promoted user)
2. Access admin-only features:
   - Admin dashboard at /admin
   - Analytics at /analytics
   - Loan management features

## 🛡️ Security Features

- Secure session tokens using JWT
- CSRF protection via state parameter
- Role-based access control
- Secure cookie settings for production
- Protected API endpoints

## 📝 Environment Variables for Enhanced Auth

For full real user authentication, ensure these are set in Render:

```
NODE_ENV=production
PORT=10000
COOKIE_SECRET=5dc337654081ee8d2369af13e7d011b2631dd7eb76c7c5fbea8135215b4e7223
JWT_SECRET=5dc337654081ee8d2369af13e7d011b2631dd7eb76c7c5fbea8135215b4e7223
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OAUTH_SERVER_URL=https://oauth.manus.im
OWNER_OPEN_ID=openid_of_admin_user  # Optional: makes this user an admin
DATABASE_URL=your_database_url_if_using_real_db  # Optional: for persistent storage
```

## 🚀 Ready to Use

Your authentication system is fully operational:
- ✅ Real user registration via OAuth
- ✅ Self-registration via /register page
- ✅ Session management
- ✅ Role-based access control
- ✅ Admin-protected features
- ✅ User management interface at /users
- ✅ Secure API endpoints

The demo user functionality remains for testing, while real users can register and authenticate through the OAuth flow!

## 📋 New User Registration and Management

### Self-Registration Process:
1. New users can visit the `/register` page
2. Fill out the registration form with:
   - Full name
   - Email address
   - Password (minimum 8 characters)
   - Business name
   - Business type
3. After registration, users receive a confirmation message
4. Users are assigned the default role of 'user'

### User Management Interface:
Admin users have access to the user management interface at `/users` where they can:
- View all registered users
- Change user roles (user/admin)
- Delete users
- Refresh user list

Admin users will see the 'User Management' link in their sidebar navigation, while regular users will not see this link.

### Promoting Users to Admin:
Admins can promote other users to admin status through the user management interface, or by setting the OWNER_OPEN_ID environment variable for initial admin setup.