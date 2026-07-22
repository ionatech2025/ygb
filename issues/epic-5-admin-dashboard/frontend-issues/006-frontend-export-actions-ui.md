## Objective

Add **Export CSV, Export Excel, and Generate PDF Report** actions to the Admin Dashboard toolbar (US-DASH-05). Exports use current filter state; show progress/spinner for large downloads.

## Architectural Context

- **Components**:
  - `DashboardExportToolbar.tsx` — three action buttons on dashboard and submission list views.

- **Secondary Adapter**:
  - Extend `dashboard-api.adapter.ts` or add `export-api.adapter.ts` — `downloadExport(format, filter)` triggers browser file download from `GET /api/v1/admin/submissions/export`.

## Technical Constraints & Clean Code

- Filename pattern: `ygb-export-{filter-hash}-{timestamp}.{ext}`.
- Disable buttons while export in flight; show error toast on failure.
- CSV/Excel must match active filters (TC-DASH-05-01).

## Acceptance Criteria & TDD Checklist

- [x] Component test: Export CSV triggers download with correct query params.
- [x] Adapter test: handles blob response and sets filename from `Content-Disposition`.
- [ ] Manual test: Excel opens with typed columns (TC-DASH-05-02).
- [x] Implement toolbar and download adapter.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/002-frontend-dashboard-filter-panel.md](002-frontend-dashboard-filter-panel.md)
- Blocked by [epic-5-admin-dashboard/backend-issues/004-backend-export-csv-excel-pdf.md](../backend-issues/004-backend-export-csv-excel-pdf.md)
