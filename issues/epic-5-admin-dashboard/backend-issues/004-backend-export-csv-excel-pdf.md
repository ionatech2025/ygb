## Objective

Implement Admin **export endpoints** for CSV, Excel (.xlsx), and PDF report generation (US-DASH-05). Exports must honour the same `DashboardFilter` as the dashboard (filtered or full dataset) and support up to **50,000 rows** without timeout or truncation.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `ExportSubmissionsQuery` with `ExportFormat` enum (`CSV`, `XLSX`, `PDF`).
  - Reuse `DashboardFilter` from issue `002`.

- **Application Services**:
  - `ExportSubmissionsService` — streams rows from SPI; delegates formatting to export adapters.

- **Adapters (Export)**:
  - `CsvExportAdapter`, `ExcelExportAdapter` (Apache POI or similar), `PdfReportAdapter` (summary stats + embedded chart snapshots or tabular summary).
  - Return `StreamingResponseBody` or temp file resource from REST layer.

- **REST**:
  - `GET /api/v1/admin/submissions/export?format=csv|xlsx|pdf&{filters}`
  - `Content-Disposition: attachment` with timestamped filename.
  - `ADMIN` role only.

## Technical Constraints & Clean Code

- **Streaming:** CSV/XLSX must stream or batch-fetch pages — do not load 50k entities into a single `List`.
- **Column typing:** Excel dates and numbers must be correctly typed (TC-DASH-05-02).
- **PDF scope:** MVP PDF includes summary stat table + filter description; full chart rendering may be frontend-generated image upload in a later polish pass.
- **Timeout:** Configure async export or increase gateway timeout for large jobs; document limits.

## Acceptance Criteria & TDD Checklist

- [x] Application test: export service applies filter to SPI before streaming.
- [x] Integration test: CSV export with district filter contains only filtered rows (TC-DASH-05-01).
- [x] Integration test: Excel file opens with header row and typed columns (TC-DASH-05-02).
- [x] Integration test: 50k-row export completes without truncation (TC-DASH-05-04) — may use `@Tag("slow")`.
- [x] Controller test: correct `Content-Type` and `Content-Disposition` headers per format.
- [x] Implement export adapters and endpoint.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/003-backend-submission-list-and-detail-apis.md](003-backend-submission-list-and-detail-apis.md)
