# Deployment Guide

## Prerequisites

- [Render account](https://render.com)
- Git repository with your code

## Environment Variables

Before deploying, ensure you have these environment variables ready:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:password@host:5432/dbname
KEY_SECRET=minimum-32-character-random-string
ALLOWED_ORIGINS=https://yourdomain.com
```

## Deployment Steps

### 1. Prepare Your Code

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

# Build frontend
npm run build
```

### 2. Deploy via render.yaml (Recommended)

The `render.yaml` file in the project root defines your entire stack:

```bash
# Push to GitHub and connect to Render
# Render will automatically detect render.yaml
```

### 3. Manual Deployment (Alternative)

#### Backend
1. Create a new Web Service on Render
2. Set:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
3. Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` (from Render PostgreSQL)
   - `KEY_SECRET` (generate a secure key)
   - `ALLOWED_ORIGINS` (your frontend URL)

#### Frontend
1. Create a new Static Site on Render
2. Set:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
3. Add a rewrite rule:
   - Source: `/*`
   - Destination: `/index.html`

#### Database
1. Create a PostgreSQL instance on Render (free tier)
2. Copy the Internal Database URL to your backend environment

### 4. Initialize Database

Run the database initialization script:

```bash
cd backend
node src/scripts/initDb.js
```

Or add as a post-deploy command in Render settings.

### 5. Verify Deployment

- Backend health: `https://your-backend.onrender.com/health`
- Frontend: `https://your-frontend.onrender.com`

## Troubleshooting

### Database Connection Failed
- Ensure DATABASE_URL is set correctly
- Check that PostgreSQL is fully provisioned (may take 1-2 minutes)

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS`

### 404 on Page Refresh
- Ensure `_redirects` file exists in frontend/public/

### Uploaded Images Not Displaying
- On Render, uploads are ephemeral and wiped on redeploy
- Consider migrating to Cloudinary or Supabase Storage

## Pre-Deploy Check

Run before deploying to catch issues:

```bash
cd backend
node src/scripts/precheck.js
```

This verifies:
- All required env vars are set
- Database is reachable
- Uploads directory exists
- Frontend build exists