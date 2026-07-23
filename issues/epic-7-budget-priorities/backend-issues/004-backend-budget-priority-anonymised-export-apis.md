## Objective

Deliver **anonymised Budget Priorities export** (US-BP-02 / BP-04): public CSV and Excel downloads of the filtered Budget Priorities dataset with PII removed or aggregated — mirroring Epic 6 public export behaviour (TC-BP-02-02).

## Architectural Context

- **Core Domain**:
  - `BudgetPriorityAnonymisedRecord` — whitelisted export columns (e.g. section, FY period, district, age group, gender, priority area selections, submitted date bucket); **exclude** phone and name.
  - Reuse `AnonymisationProjector` or dedicated BP projector.

- **Application Ports**:
  - Input (`api`): `ExportBudgetPriorityDatasetUseCase` — `(filter, format)` where `format` ∈ `{ CSV, XLSX }`.
  - Output (`spi`): reuse `BudgetPriorityDashboardReadPort` for row stream; reuse `ExportGeneratorPort` from admin/epic-6 export stack.

- **Application Services**:
  - `ExportBudgetPriorityDatasetService` — wired in `UseCaseConfig`.

- **Adapters (REST)**:
  - `GET /api/v1/public/dashboard/budget-priorities/download/csv`
  - `GET /api/v1/public/dashboard/budget-priorities/download/excel`
  - Query params: same filter set as issue `003`.
  - Response: file stream with `Content-Disposition` attachment; no auth required.

## Technical Constraints & Clean Code

- **TC-BP-02-02:** Download produces valid CSV/XLSX openable in Excel/LibreOffice.
- **TC-PUB-01-03:** Export columns audited against deny-list; integration test scans header row.
- **Reuse:** Share export generator adapter from [003-backend-public-anonymised-export-apis.md](../../epic-6-public-dashboard/backend-issues/003-backend-public-anonymised-export-apis.md).
- **Large datasets:** Stream rows; do not load entire table into memory.

## Acceptance Criteria & TDD Checklist

- [x] Write **Domain Tests** for export column whitelist — no PII column names in schema.
- [x] Write **Application Tests** with mocked read port + export generator — correct format invoked with projected rows.
- [x] Write **Controller Tests**:
  - `GET .../download/csv` → `200`, `Content-Type: text/csv`.
  - `GET .../download/excel` → `200`, spreadsheet content type.
  - Unauthenticated access allowed.
- [x] Write **Integration Test**: seed data → download → parse file → row count matches filter; no phone column present.
- [x] Implement use case, endpoints, mappers, streaming export.

## Blocked by

- [003-backend-budget-priority-dashboard-aggregation-apis.md](003-backend-budget-priority-dashboard-aggregation-apis.md) — shared filter model and read port.
