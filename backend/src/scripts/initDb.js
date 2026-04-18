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

  console.log('[initDb] Connecting to database...');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT NOW()');
      console.log('[initDb] Connected to database');
      break;
    } catch (err) {
      if (attempt === retries) {
        console.error(`[initDb] Failed to connect after ${retries} attempts: ${err.message}`);
        await pool.end();
        process.exit(1);
      }
      console.log(`[initDb] Connection attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  try {
    console.log('[initDb] Running schema.sql...');
    
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    tables.rows.forEach(t => {
      console.log(`[initDb] ✓ Table: ${t.table_name}`);
    });
    
    console.log('[initDb] Database initialized successfully.');
    
  } catch (err) {
    console.error(`[initDb] Schema initialization failed: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  await pool.end();
}

initDb();

module.exports = { initDb };