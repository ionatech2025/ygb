# Epic 9 — Public download gating & usage analytics

Issues for **US-DL-01** through **US-DL-05** from [`docs/user_stories.md`](../../docs/user_stories.md).

Public CSV/Excel download (PDM, Budget Priorities, LGO Budget Allocation) becomes **gated** behind a required profile form. The platform then records **download events** and anonymous **site visit** beacons so admins (and the public, in aggregate) can see how widely open data is used — including in the admin PDF report for donors.

**Product decisions (Aug 2026 design interview):**

| Topic | Decision |
|-------|----------|
| Gate | Form **required** before any public CSV/Excel download |
| Datasets | PDM + Budget Priorities + LGO Budget Allocation (same form/session) |
| Session | Short browser session (~1 hour / same visit) unlocks all three datasets |
| Profile | Country (ISO searchable), gender, age bracket (existing enums), field of operation (fixed list + Other specify), email (**validated**, no OTP), optional name, **required consent** |
| Download counting | **Each** download recorded (dataset + format + timestamp), linked to profile |
| Admin | Downloader table (PII) + charts filterable by age/gender |
| Visits | First-party anonymous page-view/session beacons on public routes |
| Public charts | Anonymised download aggregates only (over time + by dataset comparison) |
| PDF | Aggregate visitor/download sections only — **no** email/name appendix |

Parent PRD: [`prd.md`](./prd.md)

## Recommended implementation order

### Phase 1 — Domain, persistence, session gate
1. [backend/001-backend-download-profile-domain-and-persistence.md](backend-issues/001-backend-download-profile-domain-and-persistence.md)
2. [backend/002-backend-download-profile-registration-and-session-api.md](backend-issues/002-backend-download-profile-registration-and-session-api.md)
3. [backend/003-backend-gate-public-exports-and-record-download-events.md](backend-issues/003-backend-gate-public-exports-and-record-download-events.md)
4. [frontend/001-frontend-download-profile-form-and-session.md](frontend-issues/001-frontend-download-profile-form-and-session.md)
5. [frontend/002-frontend-wire-public-export-toolbars-to-download-gate.md](frontend-issues/002-frontend-wire-public-export-toolbars-to-download-gate.md)

### Phase 2 — Visit beacons
6. [backend/004-backend-public-visit-beacon-api.md](backend-issues/004-backend-public-visit-beacon-api.md)
7. [frontend/003-frontend-public-visit-beacon.md](frontend-issues/003-frontend-public-visit-beacon.md)

### Phase 3 — Admin analytics
8. [backend/005-backend-admin-download-usage-analytics-apis.md](backend-issues/005-backend-admin-download-usage-analytics-apis.md)
9. [frontend/004-frontend-admin-download-usage-analytics.md](frontend-issues/004-frontend-admin-download-usage-analytics.md)

### Phase 4 — Public usage visuals
10. [backend/006-backend-public-download-usage-aggregation-apis.md](backend-issues/006-backend-public-download-usage-aggregation-apis.md)
11. [frontend/005-frontend-public-download-usage-charts.md](frontend-issues/005-frontend-public-download-usage-charts.md)

### Phase 5 — Donor PDF
12. [backend/007-backend-admin-pdf-usage-analytics-sections.md](backend-issues/007-backend-admin-pdf-usage-analytics-sections.md)

## User story mapping

| User story | Backend issue(s) | Frontend issue(s) |
|------------|------------------|-------------------|
| US-DL-01 Profile required before download | 001, 002, 003 | 001, 002 |
| US-DL-02 Admin sees downloaders + charts | 005 | 004 |
| US-DL-03 Admin visitors vs downloaders | 004, 005 | 003, 004 |
| US-DL-04 PDF includes usage aggregates | 007 | — (existing Generate PDF) |
| US-DL-05 Public anonymised usage charts | 006 | 005 |

## Extends / supersedes

- **US-PUB-04**, **US-BP-02** download, **US-LGOB-02** download — remain unauthenticated (no login account), but **no longer one-click**; profile + consent required first.
- Admin PDF polish ([ui_fixes_07292026/backend/003](../fixes/ui_fixes_07292026/backend/003-backend-admin-pdf-report-enhancement.md)) — add usage sections.

## Out of scope

- Email OTP / magic-link verification (format validation only)
- Third-party analytics (Google Analytics, etc.)
- Putting downloader PII on the public dashboard or in the PDF
- Changing anonymisation rules for the downloaded PDM/BP/LGO datasets themselves

## Dependencies

- Epic 6 public export APIs and toolbars
- Epic 7 / 8 Budget Priorities and LGO Budget Allocation public exports
- Existing `Gender` / `AgeGroup` enums
- Admin PDF writer (OpenPDF)
