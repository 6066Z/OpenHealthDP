import { Router } from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import crypto from 'crypto';
import fs from 'fs';

const router = Router();

let credentials;
if (process.env.GCP_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.GCP_SERVICE_ACCOUNT_PATH)) {
  credentials = JSON.parse(fs.readFileSync(process.env.GCP_SERVICE_ACCOUNT_PATH, 'utf8'));
} else {
  credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON || '{}');
}

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID || 'ai4h2ma',
  credentials,
});

const verifyApiKey = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'];
  const providedKey = (apiKey as string) || '';
  const expectedKey = process.env.OPENHEALTH_BETA_API_KEY || 'AI4H2-PUBLIC-2023-BETA';
  
  const hmac1 = crypto.createHash('sha256').update(providedKey).digest();
  const hmac2 = crypto.createHash('sha256').update(expectedKey).digest();

  if (!crypto.timingSafeEqual(hmac1, hmac2)) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Valid x-api-key header required.' });
  }
  next();
};

const validateInput = (req: any, res: any, next: any) => {
  const { bundleId, city, zip, state } = req.query;

  if (!bundleId || typeof bundleId !== 'string' || bundleId.length > 64) {
    return res.status(400).json({ error: 'Invalid or missing bundleId (max 64 characters)' });
  }

  if (city && (typeof city !== 'string' || city.length > 128)) {
    return res.status(400).json({ error: 'Invalid city format (max 128 characters)' });
  }

  if (zip && (typeof zip !== 'string' || !/^\d{5}$/.test(zip))) {
    return res.status(400).json({ error: 'Invalid zip format (must be 5 digits)' });
  }

  if (state && (typeof state !== 'string' || !/^[a-zA-Z]{2}$/.test(state))) {
    return res.status(400).json({ error: 'Invalid state format (must be 2 letters)' });
  }
  next();
};

const handleQuery = async (req: any, res: any, table: string) => {
  const { bundleId, city, zip, state } = req.query;

  let query = `SELECT * FROM \`ai4h2ma.openhealth_public.${table}\` WHERE bundle_id = @bundleId`;
  const params: any = { bundleId };

  if (state) {
    query += ` AND UPPER(state) = @state`;
    params.state = (state as string).toUpperCase();
  }
  if (city) {
    query += ` AND UPPER(city) = @city`;
    params.city = (city as string).toUpperCase();
  }
  if (zip) {
    query += ` AND zip = @zip`;
    params.zip = zip;
  }

  query += ` ORDER BY total_cost ASC LIMIT 500`;

  try {
    const [rows] = await bigquery.query({ query, params, location: 'US' });
    res.json({ count: rows.length, bundle_id: bundleId, data: rows });
  } catch (error: any) {
    console.error('BigQuery execution error (v2):', error.message, { query, params });
    res.status(500).json({ error: 'Internal server error: Unable to process data request.' });
  }
};

router.get('/outpatient', verifyApiKey, validateInput, (req, res) => {
  handleQuery(req, res, 'v_outpatient_explorer');
});

router.get('/inpatient', verifyApiKey, validateInput, (req, res) => {
  handleQuery(req, res, 'v_inpatient_explorer');
});

export default router;
