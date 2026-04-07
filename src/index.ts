import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transparencyRouter from './routes/transparency';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Transparency Routes
app.use('/api/v1/transparency', transparencyRouter);

app.listen(PORT, () => {
  console.log(`OpenHealth Public API running on http://localhost:${PORT}`);
});
