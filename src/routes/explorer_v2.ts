import { Router } from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import crypto from 'crypto';
import fs from 'fs';
import { logger } from '../utils/logger';

const router = Router();

/**
 * BigQuery Client Initialization
 * Support Application Default Credentials (ADC) for Cloud Run
 */
const getBigQueryClient = () => {
  const options: any = {
    projectId: process.env.GCP_PROJECT_ID || 'ai4h2ma',
    location: 'US',
  };

  // Support JSON credentials from env if provided; otherwise fallback to ADC
  if (process.env.GCP_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.GCP_SERVICE_ACCOUNT_PATH)) {
    options.keyFilename = process.env.GCP_SERVICE_ACCOUNT_PATH;
  } else if (process.env.GCP_SERVICE_ACCOUNT_JSON) {
    try {
      options.credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      logger.warn('Failed to parse GCP_SERVICE_ACCOUNT_JSON, falling back to ADC');
    }
  }

  return new BigQuery(options);
};

const bigquery = getBigQueryClient();

// Safety: Safeguard against runaway query costs (Default to 1GB per query)
const MAX_BYTES_BILLED = parseInt(process.env.BQ_MAX_BYTES_BILLED || '1000000000');

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
  const { bundleId, city, zip, state, year } = req.query;

  if (!bundleId || typeof bundleId !== 'string' || bundleId.length > 64) {
    return res.status(400).json({ error: 'Invalid or missing bundleId (max 64 characters)' });
  }

  if (year && (typeof year !== 'string' || !/^\d{4}$/.test(year))) {
    return res.status(400).json({ error: 'Invalid year format (must be 4 digits)' });
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
  const { bundleId, city, zip, state, year } = req.query;
  const project = process.env.GCP_PROJECT_ID || 'ai4h2ma';

  let query = `SELECT * FROM \`${project}.openhealth_public.${table}\` WHERE bundle_id = @bundleId`;
  const params: any = { bundleId };

  if (year) {
    query += ` AND source_year = @year`;
    params.year = parseInt(year as string);
  }
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
    const [rows] = await bigquery.query({ 
      query, 
      params, 
      location: 'US',
      maximumBytesBilled: MAX_BYTES_BILLED.toString()
    });
    res.json({ count: rows.length, bundle_id: bundleId, data: rows });
  } catch (error: any) {
    // 3. Prevent Information Leakage - log internally, return generic error
    logger.error('BigQuery execution error (v2)', { error: error.message, query, params });
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
