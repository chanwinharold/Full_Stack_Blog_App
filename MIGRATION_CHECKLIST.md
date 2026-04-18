# PostgreSQL Migration Checklist

## Status: COMPLETE

---

## Files Modified

- [x] `backend/package.json` - Replaced mysql2 with pg
- [x] `backend/config/db.js` - New PostgreSQL connection with Pool
- [x] `backend/server.js` - Added connection test on startup
- [x] `backend/controllers/user.js` - Converted to async/await with $1 placeholders
- [x] `backend/controllers/post.js` - Converted to async/await with $1 placeholders  
- [x] `backend/middlewares/auth.js` - Converted to async/await with $1 placeholders
- [x] `backend/blog_db.js` - REMOVED (old MySQL connection)
- [x] `backend/.env.example` - Updated with PostgreSQL vars

## New Files Created

- [x] `backend/schema.sql` - PostgreSQL schema with SERIAL, indexes
- [x] `backend/migrate_data.js` - MySQL to PostgreSQL migration script
- [x] `README.md` - Updated with PostgreSQL deployment section

---

## Query Placeholder Updates

All `?` placeholders converted to `$1, $2, $3...`:

| File | Query Type | Old | New |
|------|----------|-----|-----|
| user.js | SELECT user | `WHERE email = ?` | `WHERE email = $1` |
| user.js | INSERT user | `VALUES (?, ?, ?)` | `VALUES ($1, $2, $3)` |
| user.js | SELECT by username | `WHERE username = ?` | `WHERE username = $1` |
| post.js | INSERT post | `VALUES (?, ?, ?, ?, ?, ?)` | `VALUES ($1, $2, $3, $4, $5, $6)` |
| post.js | SELECT one | `WHERE id = ?` | `WHERE id = $1` |
| post.js | SELECT all | `WHERE category = ?` | `WHERE category = $1` |
| post.js | UPDATE | `WHERE id = ? AND userId = ?` | `WHERE id = $5 AND userId = $6` |
| post.js | DELETE | `WHERE id = ? AND userId = ?` | `WHERE id = $1 AND userId = $2` |
| auth.js | SELECT user | `WHERE id = ?` | `WHERE id = $1` |

---

## Result.rows Updates

All `data[]`, `rows[0]`, `affectedRows` converted:

| File | Old Pattern | New Pattern |
|------|-------------|------------|
| user.js | `blog_db.query(..., (e, data) => { data[0] })` | `const result = await query(...); result.rows[0]` |
| post.js | `blog_db.query(..., (e, data) => { data.length })` | `const result = await query(...); result.rows.length` |
| post.js | `result.affectedRows` | `result.rowCount` |
| post.js | Return full array | `result.rows` with map for sanitization |
| auth.js | `blog_db.query(..., (e, data) => { data[0] })` | `const result = await query(...); result.rows[0]` |

---

## Schema Updates

- [x] `AUTOINCREMENT` → `SERIAL`
- [x] `INTEGER PRIMARY KEY` → `id SERIAL PRIMARY KEY`
- [x] `TEXT` remains `TEXT` (PostgreSQL)
- [x] `VARCHAR(n)` used for limited strings
- [x] `DATETIME` → `TIMESTAMP`
- [x] `FOREIGN KEY ... ON DELETE CASCADE` - works the same
- [x] `LIMIT x OFFSET y` - works the same (no change)
- [x] `NOW()` - works the same (no change)
- [x] Indexes created on category, date, userId

---

## Environment Variables

Changed from MySQL to PostgreSQL:

| Old (MySQL) | New (PostgreSQL) |
|-------------|----------------|
| `DB_HOST` | Same |
| `DB_PORT=3306` | `DB_PORT=5432` |
| `DB_USER=root` | `DB_USER=postgres` |
| `DB_PASSWORD` | Same |
| `DB_NAME` | Same |
| `DB_PORT` | Added `DB_SSL=false` |
| - | Added `DATABASE_URL=` (optional) |

---

## Local Testing

- [x] PostgreSQL installed
- [x] Database created
- [x] Schema executed
- [x] Server starts without errors
- [x] User registration works
- [x] Login works
- [x] Posts CRUD works
- [x] Auth middleware works

---

## Data Migration (if applicable)

- [ ] MySQL source database accessible
- [ ] PostgreSQL target ready
- [ ] Run `node migrate_data.js`
- [ ] Verify row counts match
- [ ] Test app with migrated data

---

## Deployment

### Render.com
- [x] PostgreSQL instance created
- [x] DATABASE_URL set in env
- [x] Schema deployed
- [x] App deployed and running

### Railway/Supabase
- [x] DATABASE_URL pattern documented
- [x] SSL configuration documented

---

## Smoke Tests

Run these commands to verify:

```bash
# Test database connection
cd backend && node -e "require('./config/db').testConnection()"

# Test user registration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test12345"}'

# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test12345"}'

# Create post (with cookie)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","category":"test","img":"","date":"2025-01-01"}'
```

---

## Rollback Plan

If migration fails:

1. Keep MySQL database running
2. Add mysql2 back to package.json:
   ```bash
   npm install mysql2
   ```
3. Restore blog_db.js
4. Update .env to MySQL credentials

---

## Notes

- PostgreSQL is stricter than MySQL: column names with capitals need double quotes
- `result.rows` is an array, not an object
- Use `result.rowCount` for affected rows
- SERIAL automatically increments, don't include in INSERT
- Use `RETURNING *` or `RETURNING id` to get inserted values
- Connection pooling is built into pg Pool
- pg returns Promises natively, no need for util.promisify

---

**Migration completed: April 18, 2026**