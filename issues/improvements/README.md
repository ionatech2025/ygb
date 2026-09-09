# Improvements

Product improvements that are not bugs and not a new epic. Numbered in recommended implementation order.

## Issue breakdown

| # | Issue | Layer | Summary |
|---|-------|-------|---------|
| 001 | [Collector own submissions history API](./001-backend-collector-own-submissions-history-api.md) | Backend | Collector-scoped list + breakdown of their PDM submissions |
| 002 | [Collector submissions history UI](./002-frontend-collector-submissions-history.md) | Frontend | Field-app breakdown screen (form types; pending sync count) |
| 003 | [Tool dataset catalogue + query + projector](./003-backend-tool-dataset-catalogue-query-projector.md) | Backend | Six-tool catalogue; synced filtered query; common header + answers − PII |
| 004 | [Public + admin per-tool download APIs](./004-backend-public-admin-per-tool-download-apis.md) | Backend | Hub CSV/Excel endpoints (session gate / ADMIN JWT) |
| 005 | [Download-usage enum + improvement feedback](./005-backend-download-usage-enum-and-improvement-feedback.md) | Backend | Six datasets + PDM legacy; optional profile feedback (admin-only) |
| 006 | [Public Download hub](./006-frontend-public-download-hub.md) | Frontend | `/download`, chart CTAs, profile feedback field |
| 007 | [Admin Download hub + analytics](./007-frontend-admin-download-hub-and-analytics.md) | Frontend | `/admin/downloads`, chart labels, admin feedback view |
| 008 | [Retire legacy public chart downloads](./008-retire-legacy-public-chart-download-apis.md) | Full stack | 410/remove old thin exports; no leftover FE callers |
| 009 | [Admin table pagination](./009-admin-table-pagination.md) | Full stack | Page users, leaderboard, and sync receipts |
| 010 | [Admin hard-delete data collector](./010-admin-hard-delete-data-collector.md) | Full stack | Delete collector account; submissions remain (`collector_id` null) |

## PRDs

| PRD | Summary |
|-----|---------|
| [Per-tool field-data downloads](./prd-per-tool-field-data-downloads.md) | Public/admin download hubs; one file per tool with full answers; no hard PII; fine-grained usage analytics; optional improvement feedback |

## Recommended order

1. **001 → 002** (done)
2. **003 → 005 → 004** (catalogue first, then analytics/feedback enum, then hub APIs that record usage)
3. **006** and **007** in parallel after 004+005
4. **008** last for the download cutover (same release as hubs)
5. **009** and **010** anytime in parallel (Manage Users: prefer one PR if both land together)
