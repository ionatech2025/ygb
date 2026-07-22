## Objective

Implement **public dashboard summary stat cards** (US-PUB-03): prominently display total submissions, counts by form type, gender split headline figures, and financial-year period breakdown — all driven by `GET /api/v1/public/dashboard/summary` and reactive to active filters.

## Architectural Context

- **Components**:
  - `PublicDashboardSummaryCards.tsx` — grid of stat cards (reuse styling patterns from admin `DashboardSummaryCards` where appropriate).

- **Services / Ports**:
  - Extend `IPublicDashboardApiPort.fetchSummary(filter)`.
  - `PublicDashboardService.ts` — orchestrates fetch with filter store.

## Technical Constraints & Clean Code

- **No PII (TC-PUB-01-02):** Display only aggregated counts — never collector or respondent names.
- **Filter reactive (TC-PUB-02-02):** Cards update when `usePublicDashboardFilterStore` changes.
- Skeleton/loading states during fetch; error banner on API failure.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: renders totals from mock API response.
- [ ] Component test: filter change triggers re-fetch with updated query params.
- [ ] Component test: no text matching phone/name patterns in rendered output.
- [ ] Adapter test: maps API JSON to domain summary model.
- [ ] Implement summary cards and wire to public dashboard service.

## Blocked by

- Blocked by [frontend-issues/003-frontend-public-dashboard-filter-panel.md](003-frontend-public-dashboard-filter-panel.md)
- Blocked by [backend-issues/002-backend-public-dashboard-aggregation-apis.md](../backend-issues/002-backend-public-dashboard-aggregation-apis.md)
