## Objective

Add an **LGO Budget Allocation section to the public dashboard** (US-LGOB-02 / LGO-03, TC-LGOB-02-01): filter panel, summary stat cards, and comparative charts showing budget allocation patterns and recommendations **across Local Governments** — no PII displayed.

## Architectural Context

- **Frontend Domain**:
  - `lgo-budget-allocation-dashboard-filter.model.ts` — filter state + URL sync (mirror Epic 6/7 patterns).
  - `lgo-budget-allocation-dashboard.store.ts` — Zustand or equivalent filter store.

- **Ports**:
  - `ILgoBudgetAllocationDashboardApiPort` — `fetchSummary`, `fetchCharts`, `fetchFilterOptions`.

- **Secondary Adapter**:
  - `HttpLgoBudgetAllocationDashboardAdapter` — calls issue `003` backend endpoints.

- **Components** (`src/adapters/primary/web/public/` or `lgo-budget-allocation/dashboard/`):
  - `PublicLgoBudgetAllocationPage.tsx` — page shell with hero (reuse `publicDashboardClasses`).
  - `LgoBudgetAllocationFilterPanel.tsx`
  - `LgoBudgetAllocationSummaryCards.tsx`
  - `LgoBudgetAllocationCharts.tsx` — cross-district comparative visualisation (bar/heatmap as appropriate).

- **Routes**:
  - `/dashboard/lgo-budget-allocation` (or integrated tab — document chosen UX in implementation).
  - Link from public nav and/or main dashboard hero (PUB-08).

## Technical Constraints & Clean Code

- **TC-LGOB-02-01:** Comparative cross-district view visible with mock multi-district data.
- **No PII:** Component tests assert rendered output never contains phone-like patterns or personal names.
- **Reuse Epic 6/7:** Filter URL sync, stat cards, chart panels, theme tokens, export toolbar slot for issue `005`.
- **Empty state:** Friendly copy when no submissions match filters.

## Acceptance Criteria & TDD Checklist

- [x] Unit tests for filter model and URL serialization.
- [x] Adapter tests with mocked API responses.
- [x] Component test: page renders filter panel, summary, and charts region (TC-LGOB-02-01).
- [x] Component test: changing district filter refetches summary (mock adapter call count).
- [x] Component test: empty dataset shows empty state, not error.
- [x] Route test: unauthenticated access to LGO dashboard section.
- [x] Implement port, adapter, page, filters, summary, and charts.

## Blocked by

- Backend [003-backend-lgo-budget-allocation-dashboard-aggregation-apis.md](../backend-issues/003-backend-lgo-budget-allocation-dashboard-aggregation-apis.md)
- Epic 6 public dashboard foundation ([002](../../epic-6-public-dashboard/frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md), [003](../../epic-6-public-dashboard/frontend-issues/003-frontend-public-dashboard-filter-panel.md))
- Epic 7 dashboard patterns as reference ([004](../../epic-7-budget-priorities/frontend-issues/004-frontend-public-dashboard-budget-priorities-view.md))
