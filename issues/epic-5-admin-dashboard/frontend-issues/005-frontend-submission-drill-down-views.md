## Objective

Implement **drill-down navigation** from charts and summary stats to individual submissions (US-DASH-04): submission list view filtered by clicked dimension, full submission detail page, and back navigation preserving filters.

## Architectural Context

- **Components**:
  - `SubmissionListPage.tsx` — paginated table; reads filter + drill-down params from URL.
  - `SubmissionDetailPage.tsx` — full form payload display (polymorphic by form type).
  - Routes: `/admin/submissions`, `/admin/submissions/:id`.

- **Ports**:
  - `ISubmissionAdminApiPort.listSubmissions(filter, page)`, `getSubmissionDetail(id)`.

- **Core**:
  - `SubmissionDetailView.tsx` — shared read-only field renderer per form type.

## Technical Constraints & Clean Code

- Back button returns to `/admin/dashboard` with filter query params intact (TC-DASH-04-03).
- List shows: form type, respondent name, district, collector, completed date, status.
- Detail shows all captured fields + provenance (TC-DASH-04-02).

## Acceptance Criteria & TDD Checklist

- [x] Component test: chart drill-down navigates to list with district filter applied (TC-DASH-04-01).
- [x] Component test: row click opens detail view.
- [x] Component test: back navigation preserves prior dashboard filters.
- [x] Adapter test: list/detail API calls include auth header.
- [x] Implement pages, adapter, routes.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/004-frontend-dashboard-charts.md](004-frontend-dashboard-charts.md)
- Blocked by [epic-5-admin-dashboard/backend-issues/003-backend-submission-list-and-detail-apis.md](../backend-issues/003-backend-submission-list-and-detail-apis.md)
