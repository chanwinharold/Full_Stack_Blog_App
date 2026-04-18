require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const compression = require("compression");
const path = require("path");
const { existsSync, mkdirSync } = require("fs");

const config = require("./src/config");
const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[cors] Blocked request from origin: ${origin}`);
      console.error(`[cors] Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

if (config.isProduction) {
  app.use(compression());
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "https://full-stack-blog-app-vo1q.onrender.com"],
    }
  },
  hsts: config.isProduction ? { maxAge: 31536000, includeSubDomains: true } : false
}));

app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const authRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/auth', authRateLimiter);
app.use('/posts', apiRateLimiter);

const uploadDir = config.isProduction 
  ? path.join(__dirname, 'uploads')
  : path.join(__dirname, '../frontend/public/uploads');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir, {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = config.MAX_FILE_SIZE_MB * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").at(-1).toLowerCase();
    const safeExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const safeExt = safeExtensions.includes(extension) ? extension : 'jpg';
    const filename = `${uuidv4()}.${safeExt}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.'), false);
    }
    cb(null, true);
  }
});

app.post('/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.status(200).json({ success: true, filename: req.file.filename });
});

app.get('/health', async (req, res) => {
  try {
    const { pool } = require('./config/db');
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', uptime: process.uptime() });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.use("/auth", userRoutes);
app.use("/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;