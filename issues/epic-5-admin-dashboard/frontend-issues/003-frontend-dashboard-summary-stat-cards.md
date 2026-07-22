## Objective

Render **summary stat cards** at the top of the Admin Dashboard (US-DASH-03): total submissions, by form type, by district (top N), gender split summary, and by financial year period. Cards update when filters change.

## Architectural Context

- **Components**:
  - `DashboardSummaryCards.tsx` — grid of stat cards above charts.
  - `StatCard.tsx` — reusable metric display.

- **Core**:
  - `DashboardService.ts` — calls `GET /api/v1/admin/dashboard/aggregates` via port; maps response to card view models.

- **Ports**:
  - `IDashboardApiPort.fetchAggregates(filter)`.

## Technical Constraints & Clean Code

- Cards visible above the fold on 1440px viewport (TC-DASH-03-01).
- Loading skeleton while fetching; error banner on failure.
- Recalculate on filter change (TC-DASH-03-02).

## Acceptance Criteria & TDD Checklist

- [ ] Component test: cards render with mocked aggregate data.
- [ ] Component test: filter change triggers new API call with updated params.
- [ ] Service test: maps API response to card labels correctly.
- [ ] Implement service, adapter, components; wire into `AdminDashboardHome`.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/002-frontend-dashboard-filter-panel.md](002-frontend-dashboard-filter-panel.md)
- Blocked by [epic-5-admin-dashboard/backend-issues/001-backend-dashboard-aggregation-query-apis.md](../backend-issues/001-backend-dashboard-aggregation-query-apis.md)
