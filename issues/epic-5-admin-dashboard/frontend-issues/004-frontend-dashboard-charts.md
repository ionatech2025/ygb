## Objective

Implement **dashboard charts** (US-DASH-01): bar chart (submissions by district), pie chart (gender split), and line graph (submissions over time). Charts consume the same aggregates API as summary cards and respect active filters.

## Architectural Context

- **Components**:
  - `DashboardCharts.tsx` — layout grid for three chart types.
  - `SubmissionsByDistrictChart.tsx`, `GenderSplitChart.tsx`, `SubmissionsOverTimeChart.tsx`.
  - Use **Recharts** (or existing chart library if already in `package.json`).

- **Interaction (prep for drill-down)**:
  - Chart segment click emits `{ dimension, value }` event for issue `005`.

## Technical Constraints & Clean Code

- Render within 4 s for large datasets — rely on server-side aggregation, not client-side row processing (TC-DASH-01-03).
- Responsive: stack vertically on mobile.
- Accessible: chart titles, aria labels on segments.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: all three chart types render with mock data (TC-DASH-01-01).
- [ ] Component test: refresh/re-fetch updates chart values (TC-DASH-01-02).
- [ ] Component test: segment click fires drill-down callback with correct dimension.
- [ ] Implement charts; wire to `DashboardService` and filter store.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/003-frontend-dashboard-summary-stat-cards.md](003-frontend-dashboard-summary-stat-cards.md)
