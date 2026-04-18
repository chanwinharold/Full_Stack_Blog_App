const required = [
  'DATABASE_URL',
  'KEY_SECRET',
  'NODE_ENV',
  'ALLOWED_ORIGINS'
];

required.forEach(key => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required env var: ${key}`);
    process.exit(1);
  }
});

const config = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  
  KEY_SECRET: process.env.KEY_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '15m',
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  REFRESH_EXPIRY: process.env.REFRESH_EXPIRY || '7d',
  
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()),
  
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB) || 2,
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development'
});

module.exports = config;