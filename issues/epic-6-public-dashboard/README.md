# Epic 6 — Public Dashboard

Issues for **US-PUB-01** through **US-PUB-06** and **US-DASH-09** (PDM information/resources) from [`docs/user_stories.md`](../../docs/user_stories.md).

The public dashboard is a **no-login** area for aggregated PDM statistics, anonymised data download, and programme context. PDM narrative content (US-DASH-09) ships as **static Markdown** from [`docs/pdm_public_info.md`](../../docs/pdm_public_info.md) — not via the deferred Epic 5 CMS ([../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md](../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md)).

API contract reference: [`backend/backend_docs/domain_arch_apis`](../../backend/backend_docs/domain_arch_apis) — Public Dashboard section.

## Recommended implementation order

### Phase 1 — Programme information (US-DASH-09, static)
1. [frontend/001-frontend-pdm-information-resources-pages.md](frontend-issues/001-frontend-pdm-information-resources-pages.md)

### Phase 2 — Public dashboard foundation (US-PUB-01, 02, 05)
2. [backend/001-backend-public-dashboard-security-and-filter-model.md](backend-issues/001-backend-public-dashboard-security-and-filter-model.md)
3. [frontend/002-frontend-public-dashboard-shell-and-navigation.md](frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md)
4. [frontend/003-frontend-public-dashboard-filter-panel.md](frontend-issues/003-frontend-public-dashboard-filter-panel.md)

### Phase 3 — Visualisations (US-PUB-03)
5. [backend/002-backend-public-dashboard-aggregation-apis.md](backend-issues/002-backend-public-dashboard-aggregation-apis.md)
6. [frontend/004-frontend-public-dashboard-summary-stat-cards.md](frontend-issues/004-frontend-public-dashboard-summary-stat-cards.md)
7. [frontend/005-frontend-public-dashboard-charts-and-heatmap.md](frontend-issues/005-frontend-public-dashboard-charts-and-heatmap.md)

### Phase 4 — Download (US-PUB-04)
8. [backend/003-backend-public-anonymised-export-apis.md](backend-issues/003-backend-public-anonymised-export-apis.md)
9. [frontend/006-frontend-public-dashboard-export-toolbar.md](frontend-issues/006-frontend-public-dashboard-export-toolbar.md)

### Phase 5 — Presentation polish (US-PUB-06)
10. [frontend/007-frontend-public-dashboard-presentation-design.md](frontend-issues/007-frontend-public-dashboard-presentation-design.md)

## User story mapping

| User story | Backend issue(s) | Frontend issue(s) |
|------------|------------------|-------------------|
| US-DASH-09 PDM resources (public read) | — (static content; CMS deferred) | 001 |
| US-PUB-01 No login, no PII | 001, 002, 003 | 002, 004, 005 |
| US-PUB-02 Interactive filters | 001, 002 | 003 |
| US-PUB-03 Rich visualisations | 002 | 004, 005 |
| US-PUB-04 CSV/Excel download | 003 | 006 |
| US-PUB-05 Shareable filter URL | 001 | 003 |
| US-PUB-06 Modern presentation design | — | 007 |

## Out of scope (Phase 2 — Epic 7/8)

- Budget Priorities public forms and dashboard section (US-BP-*)
- LGO Budget Allocation public views (US-LGOB-*)
- Admin CMS for PDM content ([008](../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md))
- **Programme Area filter** on the public dashboard (SRS PUB-03) — deferred until a submission field is defined; see [require-polishing.md](../require-polishing.md)

## Related

- Source content: [../../docs/pdm_public_info.md](../../docs/pdm_public_info.md)
- Admin dashboard reuse: [../epic-5-admin-dashboard/README.md](../epic-5-admin-dashboard/README.md)
- Public location dataset: [../epic-4-offline-sync/backend-issues/009-backend-location-dataset-endpoint.md](../epic-4-offline-sync/backend-issues/009-backend-location-dataset-endpoint.md)
- Polishing backlog: [../require-polishing.md](../require-polishing.md)
