# Production Checklist

## Build

- [x] Backend package.json has correct scripts (start, dev, build, db:init)
- [x] Backend engines field specifies Node >=20.0.0
- [x] Frontend vite.config.js has production build config
  - [x] sourcemap: false
  - [x] minify: 'terser'
  - [x] manualChunks for vendor
  - [x] chunkSizeWarningLimit: 600
- [x] Frontend base set to '/'
- [x] Frontend build runs without errors: `cd frontend && npm run build`
- [x] All React warnings fixed (keys, propTypes, useEffect deps)

## Security

- [x] Config validation - required env vars checked at startup
- [x] Config object frozen with Object.freeze
- [x] NODE_ENV=production enforced
- [x] Error responses - stack traces only in dev
- [x] Cookie secure flag true in production
- [x] Helmet configured with CSP and HSTS
- [x] CORS strict in prod, permissive in dev
- [x] No console.log with sensitive data in source
- [x] TODO/FIXME comments removed
- [x] Hardcoded localhost URLs replaced

## Database

- [x] Connection retry logic on startup (5 retries, 2s delay)
- [x] Pool configuration with SSL for production
- [x] Query timeout set (5s)
- [x] initDb.js script runs schema.sql idempotently
- [x] Database precheck verifies connectivity

## Express Server

- [x] Graceful shutdown on SIGTERM
- [x] Uncaught exception handler
- [x] Unhandled rejection handler
- [x] Structured logging (pino) for production
- [x] Compression middleware added
- [x] Static files served from Express in production
- [x] Upload directory created on startup if missing
- [x] Cache headers on GET routes
- [x] Standardized error responses {success, message, code}
- [x] NotFound middleware for 404 routes
- [x] Health check route /health

## Frontend

- [x] ErrorBoundary component wrapping app
- [x] ErrorFallback with dark aesthetic
- [x] Loading/error/success states for data fetching
- [x] Optional chaining for undefined data
- [x] React Router catch-all 404 route
- [x] _redirects file for SPA fallback
- [x] Console.log gated for production
- [x] Lazy loading for route components

## Render Config

- [x] render.yaml with backend service
- [x] render.yaml with frontend static site
- [x] render.yaml with PostgreSQL database
- [x] Health check configured

## Post-deploy Verification

- [ ] Backend responds at /health
- [ ] Frontend loads without errors
- [ ] Database queries work
- [ ] Images upload and display
- [ ] CORS correctly configured
- [ ] No console errors in production