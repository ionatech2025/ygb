# YGB SURVEY TOOL

Parish Development Model (PDM) Monitoring & Data Collection Platform

**SOFTWARE REQUIREMENTS SPECIFICATION**

| **Field** | **Details** |
|-----------|-------------|
| **Client / Organisation** | NAC — Youth Go Budget (YGB) Programme |
| **Prepared by** | Samuel Katongole — iONA Tech |
| **Date** | June 2026 |
| **Version** | 1.1 — Updated from Client Meeting |
| **Classification** | Internal / Working Document |

---

**▶ UPDATED (June 23, 2026 Meeting):** This document (v1.1) incorporates 9 clarifications agreed in the June 2026 meeting. All new or modified requirements are highlighted with the green UPDATE banner. Phase 2 items are marked with the purple PHASE 2 banner.

---

# 1. Background & Context

The Parish Development Model (PDM) is a Uganda government programme that channels funds directly to parishes to support income-generating activities, particularly for young people below 30 years of age. The Youth Go Budget (YGB) Tool — operated by Network for Active Citizens (NAC) — monitors PDM implementation by collecting structured data from four distinct respondent groups: Beneficiary Young Persons (BYP), Individual Young People (IYP), Local Government Officials (LGO), and Parish Chiefs (PCs).

A previous mobile application was used for data collection but suffered from several critical shortcomings, including lack of source-code ownership, no public-facing dashboard, poor UI design, admin-only data visibility, and limited offline capability. This document specifies requirements for a rebuilt platform that addresses all identified pain-points.

---

**Platform Scope — Two Phases**

| Phase | Description |
|-------|-------------|
| Phase 1 (MVP) | PDM Survey Tools only — BYP, IYP, LGO, and Parish Chief forms, Admin Dashboard, and Public Dashboard. |
| Phase 2 | Budget Priorities module (4 sectoral forms open to the public), LGO Budget Allocation form, and enhanced Public Dashboard integrating all data streams. |

---

# 2. Delivery Mode Recommendation

## 2.1 Assessment: Native App vs. PWA

Based on the transcribed client meeting, the following critical constraints were identified:

- Data collectors operate in rural Uganda where network connectivity is unreliable or absent (Yombe, Arua, Mayuge, Tongamo, Nakawa districts named).
- Community respondents are not technically sophisticated — they prefer a simple, guided interface.
- NAC has been burned by losing source code twice when changing developers — maintainability and code ownership are paramount.
- A separate, public-facing dashboard with charts and filters is required for donors, government officials, and staff.

## 2.2 Verdict: PWA (Progressive Web App) — Mobile-First

| **Consideration** | **Rationale** |
|-------------------|---------------|
| **Offline-first capability** | PWAs support full offline operation via Service Workers and IndexedDB. |
| **Single codebase** | One React codebase serves both the mobile survey interface and the admin dashboard. |
| **Source-code ownership** | A PWA is standard web technology — any competent developer can pick it up. |
| **Installability** | PWAs can be installed to the Android home screen via the browser prompt. |
| **Simpler deployment** | Updates ship instantly — no app store approval. |
| **Cost** | Lower long-term maintenance cost; no Apple Developer / Google Play annual fees. |

---

# 3. Stakeholders & User Roles

## 3.1 System User Roles

| **Role** | **Description** | **Permissions** |
|----------|-----------------|-----------------|
| **Data Collector (DATA_COLLECTOR)** | Field staff responsible for conducting interviews and collecting survey data using the mobile PWA. | Authenticate, complete survey forms, submit data online/offline, view personal submission statistics. |
| **Administrator (ADMIN)** | NAC staff responsible for configuring and managing the platform. Administrator accounts are created only by existing Admins. | Full access: user management, survey data, dashboards, reports, exports, system configuration, analytics. |
| **Public (PUBLIC)** | Any member of the public. No authentication required. Phase 2 allows public submission of Budget Priorities forms. | View public dashboard (no login). Phase 2: submit Budget Priorities forms after phone verification. |

---

**▶ UPDATED (June 23, 2026 Meeting):** AUTH clarification: Data Collectors shall NOT self-register. All Data Collector accounts are created by the ADMIN, who provides login credentials (phone number + password) to the collector directly. Self-registration is removed from AUTH-01.

---

## 3.2 Survey Respondent Categories

**NOTE:** The following are NOT system user roles. They are respondent categories interviewed by Data Collectors during field work. Respondents do not create accounts, authenticate, or directly access the survey application.

| **Respondent Category** | **Description** |
|-------------------------|-----------------|
| **Beneficiary Young Person (BYP)** | Young person who has benefited from the Parish Development Model (PDM). |
| **Individual Young Person (IYP)** | Young person within the community regardless of whether they have benefited from PDM. |
| **Local Government Official (LGO)** | Government official interviewed regarding PDM implementation and budget allocations. |
| **Parish Chief (PC)** | Parish Chief interviewed regarding parish-level implementation and monitoring. |

---

# 4. Functional Requirements

## 4.1 Authentication & User Management

**▶ UPDATED (June 23, 2026 Meeting):** Meeting Item 3 — No self-registration. ADMINs create all Data Collector accounts and distribute credentials (phone number + password). AUTH-01 is replaced accordingly.

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **AUTH-01** | ADMIN creates all Data Collector accounts. Each account captures Full Name, Phone Number, and a system-generated or manually assigned Password. No self-registration is permitted. The ADMIN shares login credentials (phone number + password) with the Data Collector out-of-band. | Must Have | Since data collectors are specific people already known by the ADMIN, it makes sense for the ADMIN to create them. |
| **AUTH-02** | Registered Data Collectors shall authenticate (phone number + password) before accessing survey forms. Authentication shall continue to support offline operation after an initial successful online login. | Must Have | Offline-first requirement. |
| **AUTH-03** | Administrator accounts shall be created and managed only by existing Administrators. | Must Have | |
| **AUTH-04** | Administrators shall not submit field survey forms. | Must Have | |
| **AUTH-05** | The public dashboard shall be accessible without authentication and shall expose only aggregated and anonymised data. Personally Identifiable Information (PII) shall never be publicly accessible. | Must Have | |

---

## 4.2 PDM Survey Forms — Mobile Interface (Phase 1 MVP)

**▶ UPDATED (June 23, 2026 Meeting):** The PDM survey forms are accessible ONLY to authenticated Data Collectors. The public cannot access or submit PDM tool forms.

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **FORM-01** | PDM entry screen shows a drop-down: Respondent Category — Beneficiary Young Person (BYP), Individual Young Person (IYP), Local Government Official (LGO), Parish Chief (PC). | Must Have | Only visible to authenticated Data Collectors. |
| **FORM-02** | Beneficiary Young Person (BYP) Form: captures demographics, fund acquisition details, disbursement structure, service quality ratings, governance transparency, business development services received, and open qualitative feedback. | Must Have | From BENEFICIARY_YOUNG_PERSON__PDM form. |
| **FORM-03** | Individual Young Person (IYP) Form: captures demographics, programme awareness, information sources, application status, access barriers, community perception, and improvement suggestions. | Must Have | From INDIVIDUAL_YOUNG_PERSON__PDM form. |
| **FORM-04** | Local Government Officials (LGO) Form: captures administrative details, financial accountability (expected vs. actual funds by FY), beneficiary statistics, parish distribution, funding equity assessments, and economic impact feedback. | Must Have | From LOCAL_GOVERNMENT_OFFICIALS form. |
| **FORM-05** | Parish Level Monitoring Form: captures parish financials, beneficiary breakdown, PDC composition and capacity, monitoring and oversight tracking, and self-reliance enterprise indicators. | Must Have | From PARISH_LEVEL_MONITORING form. |
| **FORM-06** | Each survey captures respondent identification: Name, Phone Number, Gender, Age Group, District, Sub-county, Parish, and Village. Every submission automatically records the authenticated Data Collector's identity (Collector ID and Name), submission timestamp, and device identifier. | Must Have | Age ranges preferred over exact age. |
| **FORM-07** | Location fields (District → Sub-county → Parish → Village) use cascading drop-down selectors, not free text. Location data is pre-loaded for offline use. | Must Have | Client explicitly confirmed. |
| **FORM-08** | Mandatory fields are visually marked with an asterisk (*). Form cannot be submitted until all mandatory fields are complete. | Must Have | |
| **FORM-09** | Conditional logic: questions dependent on prior answers must be implemented as dynamic show/hide. | Must Have | |
| **FORM-10** | Age field must enforce a minimum of 15 years. Values below 15 are rejected. | Must Have | |
| **FORM-11** | Forms support multi-select checkboxes where indicated (e.g. information channels, barriers to access). | Must Have | |
| **FORM-12** | Open-ended text questions support free-text input with a minimum of 10 characters enforced for narrative fields. | Should Have | |
| **FORM-13** | Data Collector can see their own submission count for the current day/session without contacting admin. | Must Have | Client explicitly requested. |

---

## 4.3 Respondent Uniqueness & Data Integrity

**▶ UPDATED (June 23, 2026 Meeting):** Data collection runs twice per financial year (Jan–Jun and Jul–Dec). A respondent's phone number can only be associated with a given form type ONCE per financial year. The system must prevent a Data Collector from submitting the same form for the same respondent number more than once in the same financial year.

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **UNIQ-01** | The system enforces a per-financial-year uniqueness constraint: a respondent phone number may appear for a given form type (BYP, IYP, LGO, PC) at most once per financial year period (Jan–Jun or Jul–Dec). Duplicate entry is blocked at the point of submission on the device before syncing. | Must Have | Financial year periods: Jan 1 – Jun 30 and Jul 1 – Dec 31. |
| **UNIQ-02** | When a Data Collector attempts to record a respondent phone number that has already been submitted for the same form type in the current financial year period, the system displays a clear warning message identifying the conflict and prevents submission. | Must Have | Error message must name the form and the period. |
| **UNIQ-03** | Server-side validation replicates the uniqueness check on every sync to catch any edge cases arising from offline submissions on multiple devices. | Must Have | Duplicate syncs are flagged to ADMIN for review. |

---

## 4.4 Offline-First Data Sync

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **SYNC-01** | All submitted forms are stored in IndexedDB on the device immediately upon submission, regardless of connectivity. | Must Have | Core offline requirement. |
| **SYNC-02** | A background sync worker automatically pushes queued submissions to the server when connectivity is detected. | Must Have | |
| **SYNC-03** | A visible sync status indicator shows the data collector: connected/offline, number of submissions pending sync, and last successful sync time. | Must Have | |
| **SYNC-04** | If sync fails (server error), submissions remain queued and retry with exponential back-off. The data collector is notified. | Must Have | |
| **SYNC-05** | All Uganda district/sub-county/parish/village data is bundled into the PWA at install time and updated in the background when online. | Must Have | Required for offline location selectors. |

---

## 4.5 Admin Dashboard

**▶ UPDATED (June 23, 2026 Meeting):** Admin Dashboard must show Data Collectors and their associated respondents, with filtering by collector, form type, district, date, and other dimensions, to see who collected what and when.

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **DASH-01** | Admin dashboard displays aggregated PDM data as charts: bar charts, pie charts, line graphs over time. | Must Have | Per client: 'pie charts, graphs'. |
| **DASH-02** | Dashboard filters: District, Sub-county, Parish, Form Type, Date Range, Gender, Age Group, Data Collector, Financial Year Period. | Must Have | District filter essential per client. |
| **DASH-03** | Summary statistics prominently displayed: total submissions, by form type, by district, gender split, time-series trend, and submissions by financial year period. | Must Have | |
| **DASH-04** | Admin can drill down from aggregate view to individual submissions. | Must Have | |
| **DASH-05** | Admin can export data as CSV and Excel (filtered or full dataset). Admin can generate sharable/printable PDF reports. | Must Have | Donors need data; screenshots not acceptable. |
| **DASH-06** | Admin can manage user accounts: create, deactivate, reset passwords, assign roles. User list shows Data Collectors and the respondents they have worked with. | Must Have | No self-registration of Data Collectors. |
| **DASH-07** | Data Collector Tracker: Admin sees a leaderboard/list of Data Collectors paired with total cumulative form submissions, with filters for collector, form type, district, date range, and financial year period — to show who collected what and when. | Must Have | explicit requirement. |
| **DASH-08** | Admin sees pending-sync queue: submissions received vs. submissions still pending from field devices. | Should Have | |
| **DASH-09** | Dashboard includes a PDM information/resources section where users and public can read about the PDM programme, budget allocations, and priorities without logging in. | Should Have | Client noted this was missed in current version. |

---

## 4.6 Public Dashboard

**▶ UPDATED (June 23, 2026 Meeting):** The Public Dashboard must be highly interactive with rich filters (district, age group, gender, financial year, form type, sub-county, parish, and date range). It must display PDM data and (in Phase 2) Budget Priorities and LGO Budget Allocation data. Raw data must be downloadable as CSV/Excel by anyone (data analysts, researchers, etc.) without login. The design should be modern, intuitive, and elaborate.

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **PUB-01** | The public dashboard is accessible without authentication to all visitors including data analysts, donors, government officials, civil society organisations, and members of the public. | Must Have | No login required. |
| **PUB-02** | The dashboard displays only aggregated and anonymised PDM statistics. Individual respondent details (name, phone number) and Data Collector PII are never exposed publicly. | Must Have | PII protection. |
| **PUB-03** | Interactive filters: District, Sub-county, Parish, Age Group, Gender, Form Type (BYP/IYP/LGO/PC), Financial Year Period (Jan–Jun / Jul–Dec), and Date Range. Filters update all charts and statistics in real time. | Must Have | Programme Area filter deferred — see [require-polishing.md](../issues/require-polishing.md). |
| **PUB-04** | Charts and visualisations: bar charts (submissions by district), pie charts (gender split, age group distribution), line graphs (submission trends over time), heat maps (geographic distribution), and summary stat cards. | Must Have | |
| **PUB-05** | Raw data download: any visitor can download filtered or full PDM dataset as CSV or Excel without authentication. This enables external independent data analysis by researchers and data analysts. | Must Have | |
| **PUB-06** | Shareable filtered URL: the current filter state is reflected in the URL so stakeholders can share a specific filtered view of the dashboard (e.g. data for a specific district and age group). | Must Have | For sharing at events. |
| **PUB-07** | Design: the public dashboard must be modern, visually compelling, intuitive, and elaborate — reflecting the quality of data collected and suitable for presentation to donors, government, and international partners. | Must Have | |
| **PUB-08** | Phase 2 extension: Public Dashboard will also visualise Budget Priorities data (4 sectors) and LGO Budget Allocation data, with their own downloadable raw datasets, integrated into the same filterable interface. | Phase 2 | |

---

## 4.7 Budget Priorities Module (Phase 2)

**☁ PHASE 2 ONLY:** This entire module is scoped to Phase 2 and is NOT part of the MVP. It is documented here for planning purposes only.

**▶ UPDATED (June 23, 2026 Meeting):** Budget Priorities is a separate module filled by members of the PUBLIC (not data collectors). It has 4 sections. Any member of the public can fill a Budget Priorities section once per financial year after entering and verifying their phone number.

The Budget Priorities module collects public input on priority areas across four government sectors. Unlike the PDM tools (which are filled exclusively by Data Collectors), these forms are open to the public without authentication.

### 4.7.1 Budget Priorities Sections

| **Section** | **Description** |
|-------------|-----------------|
| **Health Sector** | Collects respondent demographics, name, phone number, and priority areas for health budget allocation. |
| **Agriculture Sector** | Collects respondent demographics, name, phone number, and priority areas for agriculture budget allocation. |
| **Education Sector** | Collects respondent demographics, name, phone number, and priority areas for education budget allocation. |
| **Climate Change Mitigation & Adaptation** | Collects respondent demographics, name, phone number, and priority areas for climate-related budget allocation. |

### 4.7.2 Budget Priorities Access Rules

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **BP-01** | Budget Priorities forms are publicly accessible without login. Any member of the public can fill any of the four sectoral forms. | Phase 2 | |
| **BP-02** | Before filling a Budget Priorities section, the member of the public enters their phone number. The system verifies that this phone number has not already submitted that specific section in the current financial year period. | Phase 2 | One submission per section per person per FY period. |
| **BP-03** | A person from the public may submit each of the four Budget Priorities sections once per financial year period. The uniqueness check is per section (not across all sections). | Phase 2 | A person can fill all 4 sections, but each section only once per FY period. |
| **BP-04** | Budget Priorities data is visually displayed on the public dashboard and is downloadable as CSV/Excel alongside PDM data. | Phase 2 | |

---

## 4.8 LGO Budget Allocation Form (Phase 2)

**☁ PHASE 2 ONLY:** This form is scoped to Phase 2 and is NOT part of the MVP.

**▶ UPDATED (June 23, 2026 Meeting):** A standalone form independent from PDM tools and Budget Priorities, filled by Local Government Officials (LGOs) with the explicit assistance of Data Collectors. The form seeks to understand how the previous year's budget was allocated and elicit recommendations for the coming financial year.

| **ID** | **Requirement** | **Priority** | **Notes** |
|--------|-----------------|--------------|-----------|
| **LGO-01** | The LGO Budget Allocation form is filled exclusively by Data Collectors interviewing Local Government Officials. LGOs cannot self-submit this form. | Phase 2 | |
| **LGO-02** | The form captures: how the previous financial year's budget was allocated across sectors, the LGO's rationale for those allocations, and their recommendations for the coming financial year. | Phase 2 | Detailed question list to be defined in Phase 2 design. |
| **LGO-03** | Data from multiple LGOs across different districts is aggregated and visualised on the public dashboard — showing comparative budget priorities and recommendations across Local Governments. | Phase 2 | |
| **LGO-04** | LGO Budget Allocation data is downloadable as CSV from the public dashboard. | Phase 2 | |

---

# 5. Non-Functional Requirements

## 5.1 Performance

- App shell and forms must load within 3 seconds on a 3G connection on first visit after installation.
- After installation, all core screens (forms, offline queue, submission count) must load in under 1 second with zero network access.
- Dashboard charts must render within 4 seconds for datasets up to 50,000 submissions.

## 5.2 Accessibility & Usability

- Mobile-first: primary design target is 360–414 px Android viewports.
- Forms use large tap targets (minimum 48 × 48 dp), high-contrast text, and clear error messages.
- Forms are available in English. Luganda/Swahili language toggle is a future enhancement.
- Data collectors with low digital literacy must be able to complete a form in under 5 minutes with no training beyond a 15-minute orientation.

## 5.3 Security

- All data in transit encrypted via HTTPS/TLS 1.3.
- Locally stored data in IndexedDB is encrypted using the Web Crypto API with a device-bound key.
- JWT tokens expire after 24 hours; refresh tokens expire after 30 days.
- Admin routes protected by role-based access control (RBAC).
- PII (name, phone number) is stored server-side only and never included in public API responses.

## 5.4 Scalability

- Backend must handle concurrent submissions from up to 500 simultaneous field users.
- Database schema must support future addition of new form types without structural migration.

## 5.5 Maintainability

- Full source code maintained by iONA Tech on behalf of NAC in a dedicated GitHub repository.
- README includes setup, environment variables, deployment instructions, and database migration guide.
- New form questions must be addable via admin UI configuration without a code deploy.

---

# 6. Recommended Technology Stack

| **Layer** | **Recommended Technology** |
|-----------|----------------------------|
| **Frontend (PWA + Admin)** | React + Vite with App Router |
| **Styling** | Tailwind CSS |
| **Offline Storage (Device)** | IndexedDB via Dexie.js |
| **Background Sync** | Service Worker (Workbox) |
| **State Management** | Zustand or React Query (TanStack Query) |
| **Charts / Dashboard** | Apache ECharts (preferred for interactive public dashboard) or Recharts |
| **Backend API** | Spring Boot 4.x (Java 21) |
| **Authentication** | Spring Security + JWT (Access + Refresh tokens) |
| **Primary Database** | PostgreSQL 16 |
| **Cache / Queue** | Redis (for sync queue status and session management) |
| **File / Export Storage** | Local File Storage (Future: MinIO or AWS S3) |
| **Containerisation** | Docker + Docker Compose |
| **Hosting** | Contabo VPS (Uganda) |
| **CI/CD** | GitHub Actions |

---

# 7. High-Level Data Model

The following entities form the core schema. A detailed ERD will be produced during detailed design.

| **Entity** | **Key Fields** |
|------------|----------------|
| **User** | user_id, name, phone_number, password_hash, role (ADMIN \| DATA_COLLECTOR), created_at, is_active, created_by_admin_id |
| **Respondent** | respondent_id, respondent_type (BYP \| IYP \| LGO \| PC), name, phone_number, gender, age_group, district_id, sub_county_id, parish_id, village_id |
| **Submission** | submission_id, submitted_by (collector_id), respondent_id, form_type, financial_year_period, submitted_at, status (PENDING \| SYNCED \| FLAGGED \| DUPLICATE), district_id, parish_id, synced_at, device_submission_id |
| **Location (District / SubCounty / Parish / Village)** | Hierarchical: district_id → name, region \| sub_county_id → name, district_id \| parish_id → name, sub_county_id \| village_id → name, parish_id |
| **BYP Response** | byp_response_id, submission_id, fund_receipt_duration, actual_amount, cash_received, instalment_period, pdc_rating, pdm_rating, group_transparency, business_services (JSONB), improvement_suggestion |
| **IYP Response** | iyp_response_id, submission_id, pdm_awareness, information_channels (JSONB), eligibility_aware, applied, rejection_reason, barriers (JSONB), correct_targeting, youth_fund_aware, opinion, improvement_suggestion |
| **LGO Response** | lgo_response_id, submission_id, fy_data (JSONB), parish_coverage (JSONB), commitment_reflected, fund_adequate, increment_recommended, equitable_distribution, spend_compliant, economic_transformation, improvement_suggestion |
| **Parish Monitoring Response** | pm_response_id, submission_id, fund_expected, fund_received, beneficiary_counts (JSONB), pdc_composition (JSONB), pdc_training, pdc_effectiveness, monitoring_conducted, self_reliance_indicators (JSONB) |
| **Phase 2: BudgetPrioritySubmission** | bp_id, phone_number, section (HEALTH \| AGRICULTURE \| EDUCATION \| CLIMATE), priority_areas (JSONB), demographic_data (JSONB), submitted_at, financial_year_period |
| **Phase 2: LGOBudgetAllocation** | lba_id, submission_id (via data collector), lgo_respondent_id, previous_fy_allocations (JSONB), rationale, recommendations, submitted_at |

---

# 8. Phasing Summary

| **Feature / Module** | **Phase 1 (MVP)** | **Phase 2** |
|----------------------|-------------------|-------------|
| PDM Survey Tools (BYP, IYP, LGO, PC) | **✔ Included** | — |
| Admin Dashboard (collector tracker, filters, exports) | **✔ Included** | — |
| Public Dashboard — PDM data, interactive filters, CSV download | **✔ Included** | — |
| Admin-managed Data Collector accounts (no self-registration) | **✔ Included** | — |
| Respondent uniqueness check per FY period | **✔ Included** | — |
| Budget Priorities (4 sectoral public forms) | — | **✔ Phase 2** |
| LGO Budget Allocation form (via data collectors) | — | **✔ Phase 2** |
| Public Dashboard — Budget Priorities & LGO Budget data integrated | — | **✔ Phase 2** |
| Public Budget Priorities forms (phone verification, one per section per FY) | — | **✔ Phase 2** |

---

# 9. Change Log

| **Version** | **Date** | **Changes** |
|-------------|----------|-------------|
| 1.0 | June 2026 | Initial draft. |
| **1.1** | June 23, 2026 | Incorporated 9 client meeting clarifications: (1) Budget Priorities deferred to Phase 2; (2) Public Dashboard raw data download + filters; (3) No self-registration for data collectors; (4) Respondent uniqueness per FY period; (5) Admin collector tracker; (6) PDM forms are data-collector-only / Budget Priorities are public; (7) Interactive public dashboard; (8) LGO Budget Allocation form deferred to Phase 2; (9) Elaborate modern public dashboard design requirement. |