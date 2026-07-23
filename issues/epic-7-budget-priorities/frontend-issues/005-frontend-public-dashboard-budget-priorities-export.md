## Objective

Add **CSV and Excel export** for the public Budget Priorities dashboard view (US-BP-02 / BP-04, TC-BP-02-02): export toolbar wired to anonymised download endpoints, respecting active BP dashboard filters.

## Architectural Context

- **Ports**:
  - Extend `IBudgetPriorityDashboardApiPort` or add `IBudgetPriorityExportApiPort` — `downloadExport(format, filter)`.

- **Secondary Adapter**:
  - `HttpBudgetPriorityExportAdapter` — `GET .../budget-priorities/download/csv|excel` with filter query string; trigger browser download (mirror `HttpPublicExportAdapter`).

- **Components**:
  - `BudgetPriorityExportToolbar.tsx` — CSV + Excel buttons, loading/error states.
  - Integrate into `PublicBudgetPrioritiesPage` hero or filter section (mirror `PublicDashboardExportToolbar` inline layout).

## Technical Constraints & Clean Code

- **TC-BP-02-02:** Clicking export downloads a file; filename includes section and date stamp.
- **Filter parity:** Export uses identical filter state as summary/charts (issue `004`).
- **Reuse:** Export button styles from `public-dashboard.theme.ts` / admin export patterns.
- **Error handling:** Show alert on failed export; disable buttons while in flight.

## Acceptance Criteria & TDD Checklist

- [ ] Adapter test: builds correct query string from filter; handles blob response.
- [ ] Component test: CSV button calls adapter with `csv` format (TC-BP-02-02).
- [ ] Component test: Excel button calls adapter with `xlsx` format.
- [ ] Component test: shows error alert when adapter rejects.
- [ ] Component test: buttons disabled while export in progress.
- [ ] Implement export port, adapter, and toolbar integrated into BP dashboard page.

## Blocked by

- [004-frontend-public-dashboard-budget-priorities-view.md](004-frontend-public-dashboard-budget-priorities-view.md) — filter state and page shell.
- Backend [004-backend-budget-priority-anonymised-export-apis.md](../backend-issues/004-backend-budget-priority-anonymised-export-apis.md).
