# Fixes — 4 August 2026

Offline / field-collection regressions observed while using the PWA without network.

## Problems observed

| # | Symptom | Notes |
|---|---------|-------|
| 1 | LGO Questionnaire **Questions 1–3** (“Financial & coverage data”) fail offline with **Load failed** / **Failed to fetch** | Section depends on live fetch of admin-set fiscal year; other form sections still render |

## Issue breakdown

| # | Issue | Layer | Summary |
|---|-------|-------|---------|
| 001 | [LGO Q1–3 offline fiscal-year load](./frontend/001-frontend-lgo-q1-3-offline-fiscal-year-cache.md) | Frontend | Cache active fiscal year for offline LGO form; fall back when network fetch fails |

## Recommended order

1. **001** — blocks collectors from completing LGO surveys offline (product rule: all forms must work offline)

## Related prior work

- [changes_07282026 backend 002](../../changes_07282026/backend/002-backend-admin-current-fiscal-year-setting.md) — admin-set fiscal year API
- [changes_07282026 frontend 005](../../changes_07282026/frontend/005-frontend-lgo-fiscal-year-admin-lock-and-two-year-comparison.md) — LGO form loads FY from `GET /api/v1/public/settings/fiscal-year`
- Location offline cache (`LocationService` + IndexedDB) — pattern to mirror for FY settings
