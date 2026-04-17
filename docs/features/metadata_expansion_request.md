# Feature Request: Metadata Expansion for Presentation Views

## Summary
The current presentation views (`v_outpatient_explorer`, `v_inpatient_explorer`) provide pricing data and NPIs but lack provider metadata (name, address, city, zip). This metadata is critical for professional longitudinal analysis using site-level normalization.

## Proposed Changes
Modify the SQL for both views to include a `LEFT JOIN` with `openhealth_public.dim_providers_v1`.

### Suggested SQL (Outpatient):
```sql
SELECT 
    CAST(f.npi AS STRING) as npi, 
    b.bundle_id, 
    f.source_year, 
    SUM(f.avg_medicare_allowed * b.multiplier) as total_cost, 
    SUM(f.avg_submitted_chrg * b.multiplier) as total_charge, 
    COUNT(*) as component_count,
    p.name,
    p.address,
    p.city,
    p.state,
    p.zip
FROM `ai4h2ma.openhealth_internal_v2.fact_prices_base` f 
JOIN `ai4h2ma.openhealth_internal_v2.ref_procedure_bundles` b 
  ON (f.procedure_id = CONCAT('CPT:', b.cpt_code))
LEFT JOIN `ai4h2ma.openhealth_public.dim_providers_v1` p 
  ON CAST(f.npi AS STRING) = p.npi
WHERE b.type = 'Outpatient' 
GROUP BY 1, 2, 3, 7, 8, 9, 10, 11
```

## Rationale
Enabling physical-site normalization allows researchers to bridge the structural break in 2021 where billing entities shifted from institutional to professional NPIs at the same physical location.
