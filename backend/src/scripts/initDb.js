require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const config = require('../config');

async function initDb(retries = 5, delay = 2000) {
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ssl: config.isProduction ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DB Init] Attempting to connect to database (attempt ${attempt}/${retries})...`);
      await pool.query('SELECT NOW()');
      console.log('[DB Init] Database connection successful');
      break;
    } catch (err) {
      if (attempt === retries) {
        console.error('[DB Init] Failed to connect after all retries:', err.message);
        await pool.end();
        process.exit(1);
      }
      console.log(`[DB Init] Connection failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  try {
    console.log('[DB Init] Running schema initialization...');
    
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('[DB Init] Schema applied successfully');
    
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('[DB Init] Tables created:', tables.rows.map(t => t.table_name).join(', '));
    
  } catch (err) {
    console.error('[DB Init] Schema initialization failed:', err.message);
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.log('[DB Init] Database initialization complete');
}

initDb();