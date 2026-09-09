## Parent PRD

[`prd-per-tool-field-data-downloads.md`](./prd-per-tool-field-data-downloads.md)

## What to build

Align download-usage analytics and the download-profile gate with the catalogue from 003:

1. ~~Expand `PublicDownloadDataset` (or successor) to **BYP, IYP, PC, LGO, BUDGET_PRIORITIES, LGO_BUDGET_ALLOCATION**~~ — **done in 004**; keep historical **`PDM`** events readable as **“PDM (legacy)”** — do not rewrite old rows.
2. Persist optional **improvement feedback** on download-profile registration (~1000–2000 chars); expose it on **admin** downloader/profile APIs only — never on public download-usage aggregates.
3. Wire public/admin download-usage **aggregations/charts** to show the six tools + “PDM (legacy)” where historical data exists (enum already accepts the six values).

Use the **same catalogue** as 003 for labels and allowed enum values so hubs and charts cannot drift.

## Acceptance criteria

- [x] Enum/persistence accepts the six hub datasets; historical `PDM` rows still load and aggregate under a legacy display label.
- [x] Public + admin download-usage aggregations return the six tools + legacy PDM where historical data exists.
- [x] Flyway: nullable improvement-feedback text on download profiles (or 1:1 table keyed by profile id).
- [x] `POST` download-profile accepts optional `improvementFeedback`; omitted/blank still succeeds.
- [x] Admin downloader/profile read APIs include feedback when present; public dashboard/analytics responses never include it.
- [x] Adapter/integration tests: enum persistence, feedback round-trip admin-only, aggregation labels.

## Blocked by

- [`003-backend-tool-dataset-catalogue-query-projector.md`](./003-backend-tool-dataset-catalogue-query-projector.md) — catalogue is the single source of allowed datasets and display labels.

## User stories addressed

- 16, 17, 18, 19, 25, 26, 27

## Implemented

- `V29__Download_Profile_Improvement_Feedback_And_Hub_Datasets.sql` — `improvement_feedback` + widen `download_events.dataset` CHECK
- Optional `improvementFeedback` on register DTO/command/domain/entity (max 2000)
- Admin `DownloaderSummary` / DTO / SQL include feedback
- Public + admin aggregate services map `byDataset` via `ToolDownloadCatalogue.analyticsDisplayLabel`
- PDF report assembler uses catalogue labels (`PDM (legacy)`, `Budget Allocations`, …)
- `improvementFeedback` added to public PII deny-list keys
