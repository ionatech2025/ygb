## Objective

Add a **Budget Priorities section to the public dashboard** (US-BP-02 / BP-04, TC-BP-02-01): sector selector, filter panel (reuse public dashboard patterns), summary stat cards, and charts for aggregated priority data — no PII displayed.

## Architectural Context

- **Frontend Domain**:
  - `budget-priority-dashboard-filter.model.ts` — extends or composes `PublicDashboardFilter` with required/optional `section`.
  - `budget-priority-dashboard.store.ts` — filter state + URL sync (mirror `usePublicDashboardFilterStore`).

- **Ports**:
  - `IBudgetPriorityDashboardApiPort` — `fetchSummary`, `fetchCharts`, `fetchFilterOptions`.

- **Secondary Adapter**:
  - `HttpBudgetPriorityDashboardAdapter` — calls issue `003` backend endpoints.

- **Components** (`src/adapters/primary/web/public/` or `budget-priorities/dashboard/`):
  - `PublicBudgetPrioritiesPage.tsx` — page shell with hero (reuse `publicDashboardClasses`).
  - `BudgetPriorityDashboardFilterPanel.tsx` — section + shared location/demographic filters.
  - `BudgetPrioritySummaryCards.tsx` — KPI cards by sector / top priority areas.
  - `BudgetPriorityCharts.tsx` — chart panels (reuse ECharts patterns from `PublicDashboardCharts`).

- **Routes**:
  - `/dashboard/budget-priorities` or tab/section within existing public dashboard (document chosen UX in implementation).
  - Link from main public nav and Budget Priorities index.

## Technical Constraints & Clean Code

- **TC-BP-02-01:** Aggregated data visible by sector; switching section updates charts.
- **No PII:** Component tests assert rendered output never contains phone-like patterns or raw names from API.
- **Reuse Epic 6:** Filter URL sync, stat card, chart panel, and theme tokens from public dashboard.
- **Empty state:** Friendly copy when no submissions match filters.

## Acceptance Criteria & TDD Checklist

- [ ] Unit tests for filter model and URL serialization.
- [ ] Adapter tests with mocked API responses.
- [ ] Component test: page renders section selector and summary region (TC-BP-02-01).
- [ ] Component test: changing section refetches summary (mock adapter call count).
- [ ] Component test: empty dataset shows empty state, not error.
- [ ] Route test: unauthenticated access to BP dashboard section.
- [ ] Implement port, adapter, page, filters, summary, and charts.

## Blocked by

- Backend [003-backend-budget-priority-dashboard-aggregation-apis.md](../backend-issues/003-backend-budget-priority-dashboard-aggregation-apis.md).
- Epic 6 public dashboard foundation ([002](../../epic-6-public-dashboard/frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md), [003](../../epic-6-public-dashboard/frontend-issues/003-frontend-public-dashboard-filter-panel.md)).
