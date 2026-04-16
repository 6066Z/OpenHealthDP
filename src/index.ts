import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import transparencyRouter from './routes/transparency';
import explorerV2Router from './routes/explorer_v2';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Security: Enforce HTTPS in production environments
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// Security: Add helmet for basic headers
app.use(helmet());

// Security: CORS Configuration (Gap Fix Phase 1)
const allowedOrigins = [
  'http://localhost:3000', // Local dev
  'https://openhealth-ma.vercel.app', // Frontend (example)
  /\.ai4h2\.org$/ // All subdomains of ai4h2.org
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => (o instanceof RegExp ? o.test(origin) : o === origin))) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'), false);
  }
}));

// Security: Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use(limiter);

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Transparency Routes (Deprecated)
app.use('/api/v1/transparency', transparencyRouter);

// Explorer Routes (v2)
app.use('/api/v2/explorer', explorerV2Router);

const server = app.listen(PORT, () => {
  logger.info(`OpenHealth Public API v2 running on port ${PORT}`, { version: '2.3.0', env: process.env.NODE_ENV });
});

// Graceful Shutdown (Gap Fix Phase 1)
const shutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    logger.info('Http server closed. Exiting process.');
    process.exit(0);
  });

  // Force close after 10s drain window
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
