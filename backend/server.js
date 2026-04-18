require('dotenv').config();
const http = require('http');
const path = require('path');
const { Pool } = require('pg');
const { existsSync, mkdirSync } = require('fs');

const app = require('./app');
const config = require('./src/config');

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.isProduction ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function connectWithRetry(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT NOW()');
      console.log('Database connected');
      await pool.query('SET statement_timeout = 5000');
      console.log('Query timeout set to 5s');
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`DB connection attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

function ensureUploadsDir() {
  const uploadPath = path.join(__dirname, '../uploads');
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
    console.log('Created uploads directory');
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

let server;

async function startServer() {
  try {
    console.log(`Starting server in ${config.NODE_ENV} mode...`);
    
    await connectWithRetry();
    ensureUploadsDir();
    
    server = http.createServer(app);
    
    server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  if (server) {
    server.close(async () => {
      await pool.end();
      console.log('Server closed gracefully');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forced exit after timeout');
      process.exit(1);
    }, 10000);
  }
});

startServer();

module.exports = { pool };