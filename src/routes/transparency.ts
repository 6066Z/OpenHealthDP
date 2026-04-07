import { Router } from 'express';
import { BigQuery } from '@google-cloud/bigquery';

const router = Router();

const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON || '{}');
const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID || 'ai4h2ma',
  credentials,
});

router.get('/', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { procedureId, city, zip } = req.query;

  if (apiKey !== (process.env.OPENHEALTH_BETA_API_KEY || 'AI4H2-PUBLIC-2023-BETA')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Valid x-api-key header required.' });
  }

  if (!procedureId) {
    return res.status(400).json({ error: 'Missing procedureId' });
  }

  let query = `SELECT p.name, p.address, p.city, p.zip, f.avg_charge, f.avg_allowed, f.procedure_id
    FROM \`ai4h2ma.openhealth_ma.dim_providers\` AS p
    JOIN \`ai4h2ma.openhealth_ma.fact_prices\` AS f ON p.npi = f.npi
    WHERE f.procedure_id = @procedureId`;

  const params: any = { procedureId };
  if (city) { query += ` AND UPPER(p.city) = @city`; params.city = (city as string).toUpperCase(); }
  if (zip) { query += ` AND p.zip = @zip`; params.zip = zip; }
  query += ` ORDER BY f.avg_charge ASC LIMIT 500`;

  try {
    const [rows] = await bigquery.query({ query, params, location: 'US' });
    res.json({ count: rows.length, procedure: procedureId, data: rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
