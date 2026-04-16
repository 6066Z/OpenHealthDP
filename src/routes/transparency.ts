import { Router } from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import crypto from 'crypto';
import fs from 'fs';

const router = Router();

let credentials;
if (process.env.GCP_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.GCP_SERVICE_ACCOUNT_PATH)) {
  credentials = JSON.parse(fs.readFileSync(process.env.GCP_SERVICE_ACCOUNT_PATH, 'utf8'));
  console.log('Credentials loaded from file:', process.env.GCP_SERVICE_ACCOUNT_PATH);
} else {
  credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON || '{}');
  console.log('Credentials loaded from ENV, keys:', Object.keys(credentials));
}

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID || 'ai4h2ma',
  credentials,
});

router.get('/', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { procedureId, city, zip } = req.query;

  // 1. Timing-safe comparison of API Key
  const providedKey = (apiKey as string) || '';
  const expectedKey = process.env.OPENHEALTH_BETA_API_KEY || 'AI4H2-PUBLIC-2023-BETA';
  
  const hmac1 = crypto.createHash('sha256').update(providedKey).digest();
  const hmac2 = crypto.createHash('sha256').update(expectedKey).digest();

  if (!crypto.timingSafeEqual(hmac1, hmac2)) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Valid x-api-key header required.' });
  }

  // 2. Strict Input Validation
  if (!procedureId || typeof procedureId !== 'string' || procedureId.length > 64) {
    return res.status(400).json({ error: 'Invalid or missing procedureId (max 64 characters)' });
  }

  if (city && (typeof city !== 'string' || city.length > 128)) {
    return res.status(400).json({ error: 'Invalid city format (max 128 characters)' });
  }

  if (zip && (typeof zip !== 'string' || !/^\d{5}$/.test(zip))) {
    return res.status(400).json({ error: 'Invalid zip format (must be 5 digits)' });
  }

  let query = `SELECT p.name, p.address, p.city, p.zip, f.avg_charge, f.avg_allowed, f.procedure_id, f.source_year
    FROM \`ai4h2ma.openhealth_ma.dim_providers\` AS p
    JOIN \`ai4h2ma.openhealth_ma.fact_prices\` AS f ON p.npi = f.npi
    WHERE f.procedure_id = @procedureId`;

  const params: any = { procedureId };
  if (city) { 
    query += ` AND UPPER(p.city) = @city`; 
    params.city = (city as string).toUpperCase(); 
  }
  if (zip) { 
    query += ` AND p.zip = @zip`; 
    params.zip = zip; 
  }
  query += ` ORDER BY f.avg_charge ASC LIMIT 500`;

  try {
    const [rows] = await bigquery.query({ query, params, location: 'US' });
    res.json({ count: rows.length, procedure: procedureId, data: rows });
  } catch (error: any) {
    // 3. Prevent Information Leakage - log internally, return generic error
    console.error('BigQuery execution error:', error.message, { query, params });
    res.status(500).json({ error: 'Internal server error: Unable to process data request.' });
  }
});

export default router;
