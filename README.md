# OpenHealth: Public Data API by AI4H2

OpenHealth is a public API service providing cleaned, structured access to healthcare price transparency data. It is a core product of **AI4H2**, designed to bridge the gap between complex raw government datasets and researchers, educators, and patients.

## 🚀 NEW: v2.4.1 "Year-Aware Enriched Database"

We have upgraded the API to support logically separated clinical environments (Inpatient vs. Outpatient), extended limits for regional datasets, and advanced data-science protocols bridging the 2018–2023 structural billing shifts.

### Live Production Endpoints
*   **Base URL**: `https://openhealth-dp-rtzq3cfula-ue.a.run.app`
*   **v2 Outpatient Explorer**: `/api/v2/explorer/outpatient`
*   **v2 Inpatient Explorer**: `/api/v2/explorer/inpatient`

---

## 🌟 Our Mission: AI4H2

**AI4H2 is a non-profit organization dedicated to ensuring that the life-changing potential of advanced AI in healthcare belongs to everyone, not just the privileged few.**

We build open, ethical AI solutions that:
- Close gaps in diagnosis, treatment, and care.
- Deepen patient understanding of their own health.
- Remove the barriers that keep millions from accessing the services they need.

To empower non-technical users, we have also built **[OpenHealthExplorer](https://openhealth-explorer-815397559759.us-central1.run.app/)**, a web application based on this database that allows anyone to conveniently explore healthcare prices in their neighborhood.

---

## 🏛 Non-Profit & Usage Restrictions

OpenHealth is provided by AI4H2 for **charitable, scientific, and educational purposes only.** 

⚠️ **Non-Commercial Use Only:** 
By using this API or the associated datasets, you agree that the information will not be used for any commercial purposes, including but not limited to resale, commercial software integration, or profit-generating analytics.

---

## 🚀 Project Scope: OpenHealthDP v2.4.1

This project provides a cleaned and standardized API for transparency data sourced directly from **official CMS (Centers for Medicare & Medicaid Services) public records.**

### Current Coverage:
- **Geography:** Massachusetts (MA) with zip-level granularity.
- **Data Range:** 2018 – 2023.
- **Cost Metrics:** `total_cost` (Medicare Allowed / Market Floor) and `total_charge` (Self-Pay / Market Ceiling).
- **Procedures Covered (Clinical Bundles):**
  - `MRI_BRAIN_NO_CONTRAST` (Outpatient)
  - `COLONOSCOPY_DIAGNOSTIC` (Outpatient)
  - `SEPSIS_ADMISSION` (Inpatient)
  - `KNEE_HIP_REPLACEMENT` (Inpatient)

---

## 👨‍🔬 Professional Clinical Data Science Suites

We provide fully validated, Jupyter Notebook suites demonstrating our advanced data science protocols:
- **`example_analysis/example_analysis_outpatient.ipynb`**: Analyzes MRI and Colonoscopy trends, applying "Global Bill Rescue" and "Zip-Level Normalization" to bridge the 2021 NPI churn.
- **`example_analysis/example_analysis_inpatient.ipynb`**: Analyzes Sepsis and Joint Replacement DRG bundles, correlating CMS Star Ratings with institutional overhead variance.

### Methodological Protocols Applied:
1. **Year-Aware Volume**: Sequentially capturing full volumes across years to prevent modern-data displacement.
2. **Clinical Verification**: Distinct logic for DRG bundles, Diagnostic Colonoscopies, and legacy MRI Global Bills to ensure apples-to-apples comparison.
3. **Identity-Agnostic Truth**: Separating valid pricing from identity metadata to maintain historical accuracy.

---

## 🛠 Project Structure

- **`/src`**: Node.js/TypeScript backend (Hardened for Production with constant-time HMAC verification).
- **`/example_analysis`**: High-fidelity Data Science Jupyter Notebooks.
- **`cloudbuild.yaml` / `Dockerfile`**: Production CI/CD infrastructure for GCP Cloud Run.

---

## 🚦 Getting Started (Local Development)

### 1. Setup
```bash
npm install
cp .env.example .env  # Add your GCP_PROJECT_ID and GCP credentials
```

### 2. Run API Server
```bash
npm run dev
```
The server runs on `http://localhost:3001`.

---
© 2026 AI4H2. A non-profit initiative for a more equitable healthcare future.

🛠 Built with the assistance of [Gemini CLI](https://github.com/google-gemini/gemini-cli).