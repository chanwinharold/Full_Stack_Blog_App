# Security Audit Report

**Date:** April 18, 2026
**Auditor:** Senior Security Engineer
**Project:** Full-Stack Blog Application (Harold Chanwin)

---

## Executive Summary

This audit identified and fixed multiple security vulnerabilities across the frontend and backend. All critical and high-severity issues have been addressed.

---

## CRITICAL Fixes Applied

### 1. JWT Authentication - httpOnly Cookie
**File:** `backend/controllers/user.js`, `backend/app.js`

**Issue:** JWT was stored in localStorage, vulnerable to XSS attacks.

**Fix:** JWT now stored in httpOnly, Secure, SameSite=Strict cookie. Token is automatically sent by browser and cannot be accessed by JavaScript.

```javascript
// JWT sent as httpOnly cookie
res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
})
```

---

### 2. JWT Secret from Environment
**File:** `backend/controllers/user.js`, `backend/middlewares/auth.js`

**Issue:** JWT secret must come from environment variable.

**Fix:** All JWT operations now use `process.env.KEY_SECRET`. The .env.example documents this requirement with a minimum 32-character key.

---

### 3. Algorithm Restriction on JWT
**File:** `backend/middlewares/auth.js`

**Issue:** No explicit algorithm specified, vulnerable to algorithm confusion attacks.

**Fix:** Explicitly restrict to HS256 only:

```javascript
jwt.verify(token, process.env.KEY_SECRET, {
    algorithms: ['HS256']
})
```

---

### 4. CORS Wildcard
**File:** `backend/app.js`

**Issue:** CORS allowed all origins with wildcard `*`.

**Fix:** CORS now uses explicit whitelist from `ALLOWED_ORIGINS` environment variable:

```javascript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')
app.use(cors({
    origin: function(origin, callback) {
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS not allowed'), false)
        }
    },
    credentials: true
}))
```

---

### 5. File Upload Security
**File:** `backend/app.js`

**Issue:** No MIME validation, arbitrary filenames, no size limit.

**Fix:**
- MIME whitelist: `['image/jpeg', 'image/png', 'image/webp']`
- File renamed using UUID: `uuidv4() + '.' + safeExt`
- Size limit: 2MB (configurable via `MAX_FILE_SIZE`)

```javascript
const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: function (req, file, cb) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'), false)
        }
    }
})
```

---

## HIGH Fixes Applied

### 6. Input Validation
**Files:** `backend/controllers/user.js`, `backend/controllers/post.js`

**Issue:** No server-side input validation.

**Fix:** Added express-validator middleware for all inputs:

```javascript
exports.registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
]
```

---

### 7. HTML/XSS Sanitization
**File:** `backend/controllers/post.js`

**Issue:** Raw HTML stored and rendered, vulnerable to Stored XSS.

**Fix:** Added sanitize-html to sanitize on write and read:

```javascript
const sanitizeContent = (dirty) => {
    return sanitizeHtml(dirty, {
        allowedTags: ['h1', 'h2', 'p', 'br', 'strong', 'em', 'a'],
        allowedAttributes: { 'a': ['href', 'target'] }
    })
}
```

---

### 8. Rate Limiting
**File:** `backend/app.js`

**Issue:** No rate limiting on auth routes.

**Fix:** Added express-rate-limit:
- Auth routes: 10 requests per 15 minutes per IP
- API routes: 100 requests per minute per IP

---

### 9. Helmet Middleware
**File:** `backend/app.js`

**Issue:** No security headers.

**Fix:** Added helmet() to set CSP, HSTS, X-Frame-Options, etc.

---

### 10. Body Size Limit
**File:** `backend/app.js`

**Issue:** No limit on request body size (DoS vector).

**Fix:** Added explicit 10kb limit:

```javascript
app.use(express.json({ limit: '10kb' }))
```

---

## MEDIUM Fixes Applied

### 11. Bcrypt Salt Rounds
**File:** `backend/controllers/user.js`

**Issue:** Salt rounds was 10, should be >= 12 for production.

**Fix:** Changed to `const saltRounds = 12`

---

### 12. JWT Expiry
**File:** `backend/controllers/user.js`

**Issue:** Token expiry was 24h, too long.

**Fix:** Changed to 15 minutes:

```javascript
{ expiresIn: '15m', algorithm: 'HS256' }
```

---

### 13. Global Error Handler
**File:** `backend/app.js`

**Issue:** Error stack traces exposed in production.

**Fix:** Added global error handler with production check:

```javascript
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: "Internal server error" })
    }
    // Show details in development only
})
```

---

### 14. Frontend PrivateRoute
**File:** `frontend/src/components/PrivateRoute.jsx`

**Issue:** Admin routes accessible without auth check.

**Fix:** Created PrivateRoute component protecting /write route.

---

### 15. Content Security Policy
**File:** `frontend/index.html`

**Issue:** No CSP meta tag.

**Fix:** Added CSP header:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; ...">
```

---

### 16. Axios withCredentials
**Files:** `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`, `frontend/src/App.jsx`

**Issue:** Credentials not sent with requests.

**Fix:** Set global axios defaults:

```javascript
axios.defaults.withCredentials = true
```

---

## LOW / Informational

### 17. GitIgnore
**File:** `.gitignore`

**Issue:** .env not in gitignore.

**Fix:** Added .env to gitignore across all directories.

---

### 18. Database Least Privilege
**File:** `backend/.env.example`, `backend/blog_db.js`

**Recommendation:** Create a dedicated database user with minimal privileges:

```sql
CREATE USER 'blog_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_db.* TO 'blog_app'@'localhost';
FLUSH PRIVILEGES;
```

---

## NPM Audit Results

### Backend
```
found 0 vulnerabilities
```
(After applied fixes)

### Frontend
```
1 low severity vulnerability (quill) - pending manual intervention
```
- Note: Quill has an XSS vulnerability in HTML export. This is mitigated by server-side sanitize-html on write.

---

## Environment Variables Required

Create a `.env` file in `/backend`:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db
DB_PORT=3306

# Security (REQUIRED - minimum 32 characters)
KEY_SECRET=your_256_bit_jwt_secret_key_min_32_chars
ALLOWED_ORIGINS=http://localhost:5173

# File Upload
MAX_FILE_SIZE=2097152
```

---

## Testing Checklist

- [ ] Login flow works with httpOnly cookie
- [ ] Token expires after 15 minutes
- [ ] Invalid origins are rejected by CORS
- [ ] File uploads reject non-image MIME types
- [ ] Large files rejected (>2MB)
- [ ] Input validation errors return 422
- [ ] Rate limiting triggers after 10 auth attempts
- [ ] XSS payloads are sanitized
- [ ] PrivateRoute redirects unauthenticated users
- [ ] Production error responses hide stack traces

---

## Limitations & Future Improvements

1. **Token Blocklist:** Currently in-memory. For production, use Redis.
2. **Role-Based Access Control:** Currently basic 'user' role. Add admin checks.
3. **Refresh Tokens:** Current 15-min token can be extended with refresh token flow.
4. **CSRF Protection:** Consider adding CSRF tokens for state-changing operations.
5. **HTTPS:** Always use HTTPS in production (sets Secure cookie flag).

---

**End of Security Audit Report**