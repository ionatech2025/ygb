## Objective

Build the **Data Collector Tracker** leaderboard page (US-DASH-07): sortable table of collectors by submission count, shared dashboard filters, and row drill-down to form-type/district breakdown.

## Architectural Context

- **Components**:
  - `CollectorTrackerPage.tsx` — `/admin/collectors`.
  - `CollectorLeaderboardTable.tsx`, `CollectorBreakdownPanel.tsx` (slide-over or expandable row).

- **Core**:
  - `CollectorTrackerService.ts` — fetches leaderboard + breakdown APIs.

- **Ports**:
  - `ICollectorTrackerApiPort`.

## Technical Constraints & Clean Code

- Default sort: count descending (TC-DASH-07-01).
- Reuse `DashboardFilterPanel` in compact mode for tracker filters.
- FY period filter recalculates counts (TC-DASH-07-02).

## Acceptance Criteria & TDD Checklist

- [x] Component test: leaderboard renders sorted by count.
- [x] Component test: row expand shows form type + district breakdown (TC-DASH-07-03).
- [x] Component test: FY filter triggers refetch with period param.
- [x] Implement page, service, adapter.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/002-frontend-dashboard-filter-panel.md](002-frontend-dashboard-filter-panel.md)
- Blocked by [epic-5-admin-dashboard/backend-issues/006-backend-collector-tracker-leaderboard-api.md](../backend-issues/006-backend-collector-tracker-leaderboard-api.md)
