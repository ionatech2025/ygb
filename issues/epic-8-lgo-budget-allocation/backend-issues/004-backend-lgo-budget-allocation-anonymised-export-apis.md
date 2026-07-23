## Objective

Deliver **anonymised CSV export** for LGO Budget Allocation data (US-LGOB-02 / LGO-04, TC-LGOB-02-02): public download endpoint returning a filtered, PII-stripped dataset suitable for researchers and analysts.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `ExportLgoBudgetAllocationDatasetUseCase`.
  - Output (`spi`): `LgoBudgetAllocationReadRepositoryPort` — paginated/streaming read for export rows.

- **Application Services**:
  - Map domain rows to anonymised export model (district, FY period, sector allocation columns, anonymised rationale/recommendation fields per product rules).
  - Reuse CSV streaming patterns from Epic 6/7 public export adapters.

- **Adapters (REST)**:
  - `GET /api/v1/public/dashboard/lgo-budget-allocation/download/csv`
  - Query params: same filter set as dashboard view.
  - Response: `text/csv` with `Content-Disposition` attachment filename `ygb-lgo-budget-allocation-{timestamp}.csv`.
  - Spring Security: `permitAll()`.

- **Adapters (Export)**:
  - Dedicated CSV writer adapter implementing outbound port (no business logic in controller).

## Technical Constraints & Clean Code

- **CSV only:** SRS LGO-04 specifies CSV — do not add Excel in this issue unless product expands scope.
- **No PII columns:** Export header unit test lists allowed columns; forbidden columns (phone, full name, collector id) absent.
- **Filter parity:** Export respects the same active filters as the dashboard UI (Epic 7 export pattern).
- **Streaming:** Avoid loading entire dataset into memory for large result sets.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** for anonymised export row model and CSV header constants.
- [ ] Write **Application Tests** with mocked read port — filters applied, rows mapped without PII.
- [ ] Write **Controller Tests**: GET returns `200`, `Content-Type: text/csv`, attachment disposition.
- [ ] Write **Integration Test**: seeded data → downloaded CSV parseable; no phone/name columns.
- [ ] Implement use case, export adapter, controller, WireMock/slice tests as per project conventions.

## Blocked by

- [003-backend-lgo-budget-allocation-dashboard-aggregation-apis.md](003-backend-lgo-budget-allocation-dashboard-aggregation-apis.md)
