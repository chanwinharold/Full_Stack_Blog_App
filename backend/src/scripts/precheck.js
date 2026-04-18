require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const config = require('../config');

function checkEnvVars() {
  console.log('\n=== Checking Environment Variables ===');
  const required = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_PORT',
    'KEY_SECRET',
    'NODE_ENV',
    'ALLOWED_ORIGINS'
  ];
  
  let allPresent = true;
  required.forEach(key => {
    const present = !!process.env[key];
    console.log(`  ${present ? '✓' : '✗'} ${key}: ${present ? 'present' : 'MISSING'}`);
    if (!present) allPresent = false;
  });
  
  if (!allPresent) {
    console.error('\nFATAL: Missing required environment variables');
    return false;
  }
  console.log('  All required env vars present');
  return true;
}

async function checkDatabase() {
  console.log('\n=== Checking Database Connection ===');
  const pool = new Pool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    port: config.DB_PORT,
    ssl: { rejectUnauthorized: false },
  });
  
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('  ✓ Database connected');
    console.log(`  Server time: ${result.rows[0].now}`);
    await pool.end();
    return true;
  } catch (err) {
    console.error(`  ✗ Database connection failed: ${err.message}`);
    await pool.end();
    return false;
  }
}

function checkUploadsDir() {
  console.log('\n=== Checking Uploads Directory ===');
  const uploadPath = path.join(__dirname, '../../uploads');
  
  if (!fs.existsSync(uploadPath)) {
    console.log('  Creating uploads directory...');
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('  ✓ Uploads directory created');
      return true;
    } catch (err) {
      console.error(`  ✗ Failed to create uploads directory: ${err.message}`);
      return false;
    }
  }
  
  try {
    fs.accessSync(uploadPath, fs.constants.W_OK);
    console.log('  ✓ Uploads directory exists and is writable');
    return true;
  } catch (err) {
    console.error(`  ✗ Uploads directory not writable: ${err.message}`);
    return false;
  }
}

function checkFrontendBuild() {
  console.log('\n=== Checking Frontend Build ===');
  const distPath = path.join(__dirname, '../../frontend/dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('  ✗ Frontend dist/ directory not found. Run "npm run build" in frontend directory.');
    return false;
  }
  
  const indexHtml = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    console.error('  ✗ index.html not found in dist/');
    return false;
  }
  
  console.log('  ✓ Frontend build exists');
  return true;
}

function checkSensitiveLogs() {
  console.log('\n=== Checking for Sensitive Data in Source ===');
  const sensitivePatterns = ['password', 'token', 'secret', 'key_secret'];
  const srcPath = path.join(__dirname, '../../backend/src');
  
  let issues = [];
  
  if (!fs.existsSync(srcPath)) {
    console.log('  No src directory to check');
    return true;
  }
  
  const checkDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        checkDir(fullPath);
      } else if (file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        for (const pattern of sensitivePatterns) {
          const regex = new RegExp(`console\\.(log|error).*${pattern}`, 'i');
          if (regex.test(content)) {
            issues.push(`${file}: potential sensitive data in console.${pattern}`);
          }
        }
      }
    }
  };
  
  try {
    checkDir(srcPath);
  } catch (err) {
    console.log(`  Could not check src: ${err.message}`);
  }
  
  if (issues.length > 0) {
    console.log('  Warnings found:');
    issues.forEach(i => console.log(`    - ${i}`));
  } else {
    console.log('  ✓ No obvious sensitive data leaks in logs');
  }
  
  return true;
}

async function main() {
  console.log('========================================');
  console.log('  PRE-DEPLOYMENT CHECKS');
  console.log('========================================');
  
  const results = {
    envVars: checkEnvVars(),
    database: await checkDatabase(),
    uploads: checkUploadsDir(),
    frontend: checkFrontendBuild(),
    sensitiveLogs: checkSensitiveLogs()
  };
  
  console.log('\n========================================');
  console.log('  SUMMARY');
  console.log('========================================');
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('✓ All checks passed - ready for deployment');
    process.exit(0);
  } else {
    console.log('✗ Some checks failed - please fix before deploying');
    process.exit(1);
  }
}

main();