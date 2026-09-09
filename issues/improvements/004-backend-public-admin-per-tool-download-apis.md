## Parent PRD

[`prd-per-tool-field-data-downloads.md`](./prd-per-tool-field-data-downloads.md)

## What to build

Expose **public** and **admin** hub download endpoints that use the shared catalogue/query/projector from 003:

- Public: `GET /api/v1/public/downloads/{dataset}/csv` and `.../excel` — download-session gate, records fine-grained usage, filter query params.
- Admin: `GET /api/v1/admin/downloads/{dataset}/csv` and `.../excel` — `ADMIN` JWT only, **same columns** as public.

Do **not** remove legacy chart download routes here (see 008). Do **not** build hub UI here (see 006/007).

## Acceptance criteria

- [x] Six hub datasets accepted as `{dataset}` path values; legacy `PDM` is **not** a valid hub download target (400/404).
- [x] Public endpoints require a valid download session; missing/invalid session → 401/403 as today.
- [x] Admin endpoints require `ADMIN`; non-admin → 403; no download-profile session.
- [x] CSV and Excel for all six; Content-Type and filenames are sensible; body columns match projector contract (common header + answers − PII).
- [x] Filter query params forward to the shared query (district, sub-county, parish, gender, age group, financial year).
- [x] Successful public downloads record usage with the fine-grained dataset enum (depends on enum expansion in 005 — wire once 005 lands, or land stub then align).
- [x] Controller/slice tests: gate failure, admin 403, PII-free headers, synced-only behaviour via service.
- [x] Existing admin **submissions** export (`/api/v1/admin/submissions/export`) unchanged.

## Blocked by

- [`003-backend-tool-dataset-catalogue-query-projector.md`](./003-backend-tool-dataset-catalogue-query-projector.md)
- Prefer landing after or with [`005-backend-download-usage-enum-and-improvement-feedback.md`](./005-backend-download-usage-enum-and-improvement-feedback.md) so public downloads record the six fine-grained datasets (not coarse `PDM`).

## User stories addressed

- 3, 4, 10, 11, 12, 13, 14, 15, 21, 22, 24

## Implemented

- Expanded `PublicDownloadDataset` with `BYP`, `IYP`, `PC`, `LGO` (keep `PDM` legacy); catalogue `toPublicDownloadDataset` / `hubDatasetFor`
- `ExportToolFieldDataQuery` + `ExportToolFieldDataService` + `ToolFieldExportGeneratorPort` (CSV/Excel map writers)
- `GET /api/v1/public/downloads/{dataset}/csv|excel` — session gate + fine-grained usage event
- `GET /api/v1/admin/downloads/{dataset}/csv|excel` — `ADMIN` only
- Security: `permitAll` for `/api/v1/public/downloads/**`
- Tests: public/admin controller, export service, writer adapter, catalogue mapping

## Note for 005

Enum values for hub datasets are already on `PublicDownloadDataset`. 005 should focus on analytics aggregation labels, improvement feedback schema/API, and any remaining chart label wiring.
