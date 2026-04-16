import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import transparencyRouter from './routes/transparency';
import explorerV2Router from './routes/explorer_v2';

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

// Security: Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' }
});

app.use(limiter);

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Transparency Routes (Deprecated)
app.use('/api/v1/transparency', transparencyRouter);

// Explorer Routes (v2)
app.use('/api/v2/explorer', explorerV2Router);

app.listen(PORT, () => {
  console.log(`OpenHealth Public API running on http://localhost:${PORT}`);
});
