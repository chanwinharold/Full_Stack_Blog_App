# Deployment Guide

## Prerequisites

- [Render account](https://render.com)
- [Supabase account](https://supabase.com) with a PostgreSQL database
- Git repository with your code

## Environment Variables

Before deploying, ensure you have these environment variables ready:

```
NODE_ENV=production
PORT=3000
DB_HOST=db.xxxxxxxxxxxxxxxxxxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
DB_PORT=5432
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
   - `DB_HOST` (from Supabase: Project Settings → Database → Host)
   - `DB_USER` (postgres)
   - `DB_PASSWORD` (your Supabase database password)
   - `DB_NAME` (postgres)
   - `DB_PORT` (5432)
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
- Ensure all DB_* environment variables are set correctly
- Check that Supabase project is active and not paused
- Verify DB_PASSWORD is correct (not your Supabase email password)

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS`

### 404 on Page Refresh
- Ensure `_redirects` file exists in frontend/public/

### Uploaded Images Not Displaying
- On Render, uploads are ephemeral and wiped on redeploy
- Consider migrating to Supabase Storage

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