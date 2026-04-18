/**
 * PostgreSQL Database Connection
 * Uses node-postgres (pg) with connection pooling
 */

const { Pool } = require('pg')

// Support both individual env vars and DATABASE_URL (for Render/Railway/Supabase)
let poolConfig

if (process.env.DATABASE_URL) {
    // DATABASE_URL format: postgres://user:password@host:port/database
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false
    }
} else {
    poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'blog_db',
        ssl: process.env.DB_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
        max: 20, // Max connections in pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    }
}

const pool = new Pool(poolConfig)

// Test connection on startup
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW() as now, version() as pg_version')
        console.log('PostgreSQL connected successfully')
        console.log('  PostgreSQL version:', result.rows[0].pg_version)
        console.log('  Server time:', result.rows[0].now)
    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message)
        process.exit(1)
    }
}

// Export query helper - wraps pool.query with proper error handling
// PostgreSQL returns { rows, rowCount, fields }
const query = async (text, params) => {
    try {
        const result = await pool.query(text, params)
        return result
    } catch (error) {
        console.error('Query error:', error.message)
        console.error('Query:', text)
        throw error
    }
}

// Export pool for transactions if needed
const poolEnd = async () => {
    await pool.end()
}

module.exports = {
    pool,
    query,
    testConnection,
    poolEnd
}