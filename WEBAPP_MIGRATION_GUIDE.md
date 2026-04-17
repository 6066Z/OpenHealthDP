# Communication & Migration Plan: OpenHealth WebApp v2 Transition

This document details the technical handoff to the web application team for the migration to the OpenHealth v2.3.0 "Total Coverage" API. 

## 🧠 Clinical Philosophy & Context (The "Why")
The transition from v1 to v2 is not just a schema update; it is a shift to a **Clinical Encounter Model**. This model addresses the fragmented nature of healthcare billing to provide a "Real World Price."

### 1. The Billing Dichotomy (Outpatient vs. Inpatient)
The API logic now mirrors how insurance actually pays for care:
*   **Outpatient (Discrete Services)**: Uses **Additive Logic**. An MRI is not one bill; it is a "Facility Fee" (the building/machine) + a "Professional Fee" (the doctor's reading). The API now **auto-sums** these into a single `total_cost`.
*   **Inpatient (Episode-Based Care)**: Uses **Comparative Logic**. An admission for Sepsis or a Joint Replacement is a "Bundle" that covers the entire hospital stay. The API focuses on these episodes as a single cost event.

### 2. Clinical Bundling (`component_count`)
The API now acts as a "Clinical Translator." For a procedure like a Colonoscopy, we no longer look for a single code. We look for the surgery, the pathology, and the anesthesia.
*   **Developer Tip**: Display the `component_count` in your UI. A count of 3 for an MRI (Professional + Technical + Global) indicates a high-confidence, "verified" total price.

### 3. Identity & Geography (Service Context)
We have solved the "National Lab" problem. If a patient visits a Quest Diagnostics in Boston, they should see the Boston price, even if the corporate billing office is in New Mexico.
*   **Filtering**: When a user filters by `?state=MA`, the API filters by **Service Context** (where the care happened), not the provider's registration address.

---

## 🛠 Migration Checklist for Frontend Developers

### Step A: Update Environment Variables
The frontend must point to the new production Cloud Run URLs:
- **Production URL**: `https://openhealth-dp-rtzq3cfula-ue.a.run.app`
- **Auth Header**: Ensure `x-api-key` is correctly set to the beta key in the frontend `.env`.

### Step B: Refactor API Integration Layer
| Feature | Old (v1) Integration | New (v2) Integration |
|---|---|---|
| **Base Path** | `/api/v1/transparency` | `/api/v2/explorer` |
| **Logic Type** | Single Fetch | Context-aware (Inpatient vs. Outpatient) |
| **Outpatient Path** | N/A | `/api/v2/explorer/outpatient?bundleId=...` |
| **Inpatient Path** | N/A | `/api/v2/explorer/inpatient?bundleId=...` |
| **Primary Metric** | `avg_allowed` | `total_cost` (Clinical Aggregate) |
| **Verification** | N/A | `component_count` (Data Completeness) |
| **Geography** | Provider State | Service State (`?state=XX`) |

### Step C: Update Search/Select UI
- Drop raw code searches (e.g., `CPT:70551`).
- Use Clinical Bundle IDs (e.g., `MRI_BRAIN_NO_CONTRAST`) defined in `config/procedures.json`.
- Mapping example: `CPT:70551` (v1) -> `MRI_BRAIN_NO_CONTRAST` (v2).

## 4. Communication Assets
- **Release Notes**: Refer to the `CHANGELOG.md` in the API repository.
- **Reference Analysis**: See `example_analysis_v2.md` on GitHub for live response examples and data shapes.
- **Deprecation Warning**: `/api/v1` now returns "Deprecation" headers and will be retired following the migration window.
