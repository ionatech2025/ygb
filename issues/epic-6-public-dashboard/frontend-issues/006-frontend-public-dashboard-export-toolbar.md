## Objective

Add **Download CSV** and **Download Excel** actions to the public dashboard (US-PUB-04). Exports honour the current `PublicDashboardFilter`; no authentication or login prompt at any step.

## Architectural Context

- **Components**:
  - `PublicDashboardExportToolbar.tsx` — CSV and Excel buttons on dashboard home.

- **Secondary Adapter**:
  - `public-export-api.adapter.ts` — `downloadExport(format, filter)` triggers browser file download from `GET /api/v1/public/dashboard/download/{csv|excel}`.

## Technical Constraints & Clean Code

- **No auth (TC-PUB-04-03):** Requests must not attach JWT; adapter works for anonymous visitors.
- **Filtered export (TC-PUB-04-01):** Query string matches active filter store.
- Filename pattern: `ygb-public-export-{timestamp}.{ext}`.
- Disable buttons while download in flight; error message on failure.

## Acceptance Criteria & TDD Checklist

- [x] Component test: Download CSV builds URL/query params from current filter.
- [x] Adapter test: handles blob response and filename from `Content-Disposition`.
- [x] Component test: export works without auth store / token (TC-PUB-04-03).
- [x] Manual test: inspect downloaded columns contain no PII headers (TC-PUB-04-04).
- [x] Implement toolbar and download adapter.

## Blocked by

- Blocked by [frontend-issues/003-frontend-public-dashboard-filter-panel.md](003-frontend-public-dashboard-filter-panel.md)
- Blocked by [backend-issues/003-backend-public-anonymised-export-apis.md](../backend-issues/003-backend-public-anonymised-export-apis.md)
