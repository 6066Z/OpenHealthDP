# OpenHealth: Public Data API by AI4H2

OpenHealth is a public API service providing cleaned, structured access to healthcare price transparency data. It is a core product of **AI4H2**, designed to bridge the gap between complex raw government datasets and researchers, educators, and patients.

## 🚀 NEW: v2.3.0 "Total Coverage" Release

We have upgraded the API to support logically separated clinical environments and a unified pricing model.

### Live Production Endpoints
*   **Health Check**: `https://openhealth-dp-815397559759.us-east1.run.app/health`
*   **v2 Outpatient Explorer**: `https://openhealth-dp-815397559759.us-east1.run.app/api/v2/explorer/outpatient`
*   **v2 Inpatient Explorer**: `https://openhealth-dp-815397559759.us-east1.run.app/api/v2/explorer/inpatient`

---

## 🌟 Our Mission: AI4H2

**AI4H2 is a non-profit organization dedicated to ensuring that the life-changing potential of advanced AI in healthcare belongs to everyone, not just the privileged few.**

We build open, ethical AI solutions that:
- Close gaps in diagnosis, treatment, and care.
- Deepen patient understanding of their own health.
- Remove the barriers that keep millions from accessing the services they need.

---

## 🏛 Non-Profit & Usage Restrictions

OpenHealth is provided by AI4H2 for **charitable, scientific, and educational purposes only.** 

⚠️ **Non-Commercial Use Only:** 
By using this API or the associated datasets, you agree that the information will not be used for any commercial purposes, including but not limited to resale, commercial software integration, or profit-generating analytics.

---

## 🚀 Project Scope: OpenHealthDP v2.3.0

This project provides a cleaned and standardized API for transparency data sourced directly from **official CMS (Centers for Medicare & Medicaid Services) public records.**

### Current Coverage:
- **Geography:** Massachusetts (MA) + Multi-state support via `?state=XX`.
- **Data Range:** 2018 – 2023.
- **Cost Metric:** Unified `total_cost` (clinical aggregate).
- **Procedures Covered (Clinical Bundles):**
  - MRI_BRAIN_NO_CONTRAST
  - COLONOSCOPY
  - SEPSIS_ADMISSION
  - JOINT_REPLACEMENT
  - PNEUMONIA_ADMISSION

---

## 🛠 Project Structure

- **`/src`**: Node.js/TypeScript backend (Hardened for Production).
- **`example_analysis_v2.ipynb`**: Updated Jupyter Notebook for v2.3.0 analysis.
- **`example_analysis_v2.md`**: Markdown mirror of the analysis for quick viewing.
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

### 3. Explore the Data
Open `example_analysis_v2.ipynb` to see how to programmatically query the production API.

---
© 2026 AI4H2. A non-profit initiative for a more equitable healthcare future.

🛠 Built with the assistance of [Gemini CLI](https://github.com/google-gemini/gemini-cli).
