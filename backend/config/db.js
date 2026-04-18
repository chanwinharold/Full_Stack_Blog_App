const { Pool } = require('pg');

const REQUIRED = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missing = REQUIRED.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('[db] FATAL: Missing database environment variables:', missing.join(', '));
  console.error('[db] Set them in Render: Dashboard → Service → Environment');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() as now, version() as pg_version');
    console.log('PostgreSQL connected successfully');
    console.log('  PostgreSQL version:', result.rows[0].pg_version);
    console.log('  Server time:', result.rows[0].now);
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('Query:', text);
    throw error;
  }
};

const poolEnd = async () => {
  await pool.end();
};

module.exports = {
  pool,
  query,
  testConnection,
  poolEnd
};