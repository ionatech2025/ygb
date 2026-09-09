## Parent PRD

[`prd-per-tool-field-data-downloads.md`](./prd-per-tool-field-data-downloads.md)

## What to build

In the **same release** as the hubs going live: remove or return **410 Gone** for legacy public thin/mixed download routes, and ensure no frontend still calls them. Chart export toolbars must already be gone (006); this issue is the hard cutover for APIs and any leftover clients.

## Acceptance criteria

- [x] Legacy public routes removed or 410: PDM dashboard CSV/Excel, Budget Priorities CSV/Excel, LGO Budget Allocation CSV (and any Excel sibling).
- [x] Adapter tests assert absence or 410 for those paths.
- [x] Frontend has zero callers of the legacy download URLs (grep/tests).
- [x] Hub public/admin routes remain the only field-data download path for the six tools.
- [x] Coordinate FE+BE deploy: chart pages must not hit removed endpoints.

## Blocked by

- [`006-frontend-public-download-hub.md`](./006-frontend-public-download-hub.md)
- [`007-frontend-admin-download-hub-and-analytics.md`](./007-frontend-admin-download-hub-and-analytics.md)

## User stories addressed

- 28, 29

## Implemented

- Removed legacy public download endpoints from PDM / Budget Priorities / LGO dashboard controllers (now 404)
- Deleted thin-export use cases, generators, writers, `PublicAnonymisedExport*`, and related BE tests
- Deleted orphaned FE toolbars/ports/adapters; kept hub `PublicExportFormat` labels
- Cutover test asserts zero FE callers of legacy `/dashboard/**/download/**` URLs
- Hub public/admin download APIs remain
