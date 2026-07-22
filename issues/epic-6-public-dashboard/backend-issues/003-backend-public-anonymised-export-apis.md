## Objective

Implement **public anonymised data export** endpoints (US-PUB-04): any unauthenticated visitor can download the currently filtered (or full) PDM dataset as **CSV** or **Excel**, with **no PII columns** — only `PublicAnonymisedRecord` fields suitable for independent analysis.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `ExportPublicDatasetQuery` with `ExportFormat` enum (`CSV`, `XLSX`).
  - Reuse `PublicDashboardFilter` from issue `001`.

- **Application Services**:
  - `ExportPublicDatasetService` — streams anonymised rows from SPI; never delegates to admin `ExportSubmissionsService` (which may include wider columns).

- **Adapters (Export)**:
  - `PublicCsvExportAdapter`, `PublicExcelExportAdapter` — or dedicated writers that only accept `PublicAnonymisedRecord`.
  - `StreamingResponseBody` / paged fetch — do not load 50k rows into memory.

- **REST**:
  - `GET /api/v1/public/dashboard/download/csv?{filterParams}`
  - `GET /api/v1/public/dashboard/download/excel?{filterParams}`
  - `Content-Disposition: attachment`; no `Authorization` header required (TC-PUB-04-03).

## Technical Constraints & Clean Code

- **Column whitelist:** Explicit allow-list in domain (`PublicAnonymisedRecord`); deny respondent name, phone, collector id/name, device ids.
- **Filtered export (TC-PUB-04-01):** District filter narrows rows before streaming.
- **Full export (TC-PUB-04-02):** Empty filter downloads complete anonymised dataset.
- **Streaming:** Batch/page through repository — same 50k-row NFR as admin export.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** — `PublicAnonymisedRecord` factory rejects PII field injection.
- [ ] Write **Application Tests** — export service applies filter and only streams projector output.
- [ ] Write **Integration Tests** (Testcontainers):
  - CSV with district filter contains only that district's rows (TC-PUB-04-01).
  - Full CSV/Excel with no filters includes all anonymised rows (TC-PUB-04-02).
  - Downloaded file column headers contain no PII names (TC-PUB-04-04).
- [ ] Write **Controller Tests** — unauthenticated `GET` returns correct `Content-Type`, `Content-Disposition`; no `401`/`403`.
- [ ] Implement export service, adapters, and endpoints.

## Blocked by

- Blocked by [epic-6-public-dashboard/backend-issues/001-backend-public-dashboard-security-and-filter-model.md](001-backend-public-dashboard-security-and-filter-model.md)
- Blocked by [epic-6-public-dashboard/backend-issues/002-backend-public-dashboard-aggregation-apis.md](002-backend-public-dashboard-aggregation-apis.md) *(shared `PublicAnonymisedRecord` / projector)*
