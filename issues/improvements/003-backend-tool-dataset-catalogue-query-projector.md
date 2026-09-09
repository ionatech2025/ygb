## Parent PRD

[`prd-per-tool-field-data-downloads.md`](./prd-per-tool-field-data-downloads.md)

## What to build

Domain/application foundation for per-tool field-data downloads: a **tool dataset catalogue** (six hub datasets + legacy `PDM` for historical analytics only), a **field-data export query** that returns synced rows for one dataset with AND filters, and a **tool export projector** that builds tabular rows as **common header + all tool answers including free-text**, with a hard PII deny-list.

This slice has no new HTTP download routes yet — it is the shared pipeline public and admin hubs will call.

## Acceptance criteria

- [x] Catalogue enumerates BYP, IYP, PC, LGO (questionnaire), Budget Priorities, Budget Allocations (`LGO_BUDGET_ALLOCATION`); maps UI/analytics labels ↔ storage sources; retains legacy `PDM` for historical events only (not a hub download target).
- [x] Export query: given dataset + optional filters (district, sub-county, parish, gender, age group, financial year), returns **synced-only** rows for that tool; empty filters = all synced rows for the tool; filters combine with **AND**.
- [x] Projector emits the canonical common header (dataset/form label, district/sub-county/parish **names**, gender, age group, FY period, form completed at) plus **all answer columns including free-text**.
- [x] Projector never emits blocked columns: respondent name/phone, collector name/id, device submission id, row id, status, location IDs; missing common fields are blank (e.g. Budget Priorities / Allocations).
- [x] Domain tests cover catalogue invariants, deny-list, blank common fields; application tests cover synced-only + AND filters with mocked SPI.
- [x] No public/admin download controllers in this issue (see 004).

## Blocked by

None — can start immediately.

## User stories addressed

- 5, 6, 7, 8, 9, 11, 12, 30, 31, 32, 33

## Implemented

- Domain: `ToolDownloadDataset`, `ToolDownloadCatalogue`, `ToolFieldDataFilter`, `ToolFieldDataRecord`, `ToolFieldExportInput`/`Row`, `ToolFieldDataProjector`
- Application: `QueryToolFieldDataExport` + `QueryToolFieldDataExportService` + `ToolFieldDataExportRepositoryPort`
- Adapter: `ToolFieldDataExportRepositoryAdapter` (SYNCED PDM/allocations; all BP rows; location name joins)
- Tests: `ToolDownloadCatalogueTest`, `ToolFieldDataProjectorTest`, `QueryToolFieldDataExportServiceTest`
