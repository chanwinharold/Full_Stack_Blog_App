const config = require('../config');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  
  if (config.isProduction) {
    console.error(`[ERROR] ${err.message}`);
  } else {
    console.error(`[ERROR] ${err.stack}`);
  }
  
  res.status(status).json({
    success: false,
    message: config.isProduction 
      ? 'Une erreur interne est survenue' 
      : err.message,
    code: err.code || 'INTERNAL_ERROR',
    ...(config.isDevelopment && { stack: err.stack })
  });
};

module.exports = errorHandler;