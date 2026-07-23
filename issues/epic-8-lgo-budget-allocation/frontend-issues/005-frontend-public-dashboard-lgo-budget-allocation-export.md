## Objective

Add **CSV export** for the LGO Budget Allocation public dashboard view (US-LGOB-02 / LGO-04, TC-LGOB-02-02): download toolbar integrated with active filters, triggering anonymised CSV download from the backend export API.

## Architectural Context

- **Frontend Domain**:
  - `lgo-budget-allocation-export.model.ts` — export format enum (`csv` only for LGO-04).
  - `buildLgoBudgetAllocationExportFallbackFilename()` in shared export utilities.

- **Ports**:
  - `ILgoBudgetAllocationExportApiPort` — `downloadCsv(filters)` → blob + filename.

- **Secondary Adapter**:
  - `HttpLgoBudgetAllocationExportAdapter` — `GET /api/v1/public/dashboard/lgo-budget-allocation/download/csv`.

- **Components**:
  - `LgoBudgetAllocationExportToolbar.tsx` — Download CSV button; reuse Epic 7 export toolbar layout (`inline` in hero or filter section).
  - Integrate into `PublicLgoBudgetAllocationPage.tsx`.

## Technical Constraints & Clean Code

- **TC-LGOB-02-02:** Click download → browser saves CSV file.
- **Filter parity:** Export uses the same active filter state as the dashboard (Epic 7 pattern).
- **CSV only:** No Excel button unless product expands LGO-04 scope.
- **Filename:** `ygb-lgo-budget-allocation-{filter-hint}-{timestamp}.csv`.
- **Accessibility:** Named button, loading/disabled states during download.

## Acceptance Criteria & TDD Checklist

- [x] Unit test: fallback filename builder produces expected pattern.
- [x] Adapter test: passes query params from active filters; handles `Content-Disposition`.
- [x] Component test: toolbar renders Download CSV control.
- [x] Component test: click triggers adapter and initiates browser download (mock `URL.createObjectURL`).
- [x] Component test: export disabled while loading; error message on failure.
- [x] Implement port, adapter, toolbar, and page integration.

## Blocked by

- Backend [004-backend-lgo-budget-allocation-anonymised-export-apis.md](../backend-issues/004-backend-lgo-budget-allocation-anonymised-export-apis.md)
- [004-frontend-public-dashboard-lgo-budget-allocation-view.md](004-frontend-public-dashboard-lgo-budget-allocation-view.md)
