# OpenHealth: Public Data API by AI4H2

OpenHealth is a public API service providing cleaned, structured access to healthcare price transparency data. It is a core product of **AI4H2**, designed to bridge the gap between complex raw government datasets and researchers, educators, and patients.

## 🌟 Our Mission: AI4H2

**AI4H2 is a non-profit organization dedicated to ensuring that the life-changing potential of advanced AI in healthcare belongs to everyone, not just the privileged few.**

We build open, ethical AI solutions that:
- Close gaps in diagnosis, treatment, and care.
- Deepen patient understanding of their own health.
- Remove the barriers that keep millions from accessing the services they need.

We believe that where you were born, how much you earn, or what language you speak should **never** determine the quality of health you receive.

---

## 🏛 Non-Profit & Usage Restrictions

OpenHealth is provided by AI4H2 for **charitable, scientific, and educational purposes only.** 

⚠️ **Non-Commercial Use Only:** 
By using this API or the associated datasets, you agree that the information will not be used for any commercial purposes, including but not limited to resale, commercial software integration, or profit-generating analytics.

---

## 🚀 Project Scope: OpenHealthDP MVP

This project provides a cleaned and standardized API for transparency data sourced directly from **official CMS (Centers for Medicare & Medicaid Services) public records.**

### Current Coverage (MVP):
- **Geography:** Massachusetts (MA) Only.
- **Data Range:** 2018 – 2023.
- **Source:** CMS Public Data (Medicare/Medicaid rates).
- **Procedures Covered:**
  - MRI Brain (without contrast)
  - Colonoscopy
  - Sepsis (with Major CC)
  - Joint Replacement
  - Pneumonia (with Major CC)

---

## 🗺 Future Roadmap & Evolution

As AI4H2 grows, OpenHealthDP will evolve through the following phases:

1.  **Geographic Expansion:** Adding datasets for additional states (e.g., New York, California).
2.  **Procedure Depth:** Expanding the data catalog to include a wider range of CPT/DRG codes.
3.  **Data Source Diversification:** Integrating additional official public health data sources as they become available.

---

## 🛠 Project Structure

- **`/src`:** A TypeScript/Express backend that interfaces with Google BigQuery to serve cleaned transparency data.
- **`example_analysis.ipynb`:** A Jupyter Notebook providing professional-grade analysis of market irrationality, price multipliers, and temporal trends in MA.
- **`/config`:** JSON definitions for data schemas and medical procedure mappings.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3 (for analysis)
- Google Cloud credentials for BigQuery access.

### 1. Setup
```bash
npm install
cp .env.example .env  # Add your GCP credentials here
```

### 2. Run API Server
```bash
npm run dev
```
The server runs on `http://localhost:3001`.

### 3. Explore the Data
Open `example_analysis.ipynb` to see how to programmatically query the API and perform health equity analysis. You can also view pre-rendered plots directly on GitHub.

---
© 2026 AI4H2. A non-profit initiative for a more equitable healthcare future.

🛠 Built with the assistance of [Gemini CLI](https://github.com/google-gemini/gemini-cli).
