# Epic 6 — Public Dashboard

Issues for **US-PUB-01** through **US-PUB-*** and **US-DASH-09** (PDM information/resources) from `docs/user_stories.md`.

The public dashboard is a no-login area for aggregated PDM statistics, data download, and general programme context. PDM narrative content (US-DASH-09) is implemented here as **static Markdown** sourced from `docs/pdm_public_info.md` — not via the deferred Epic 5 CMS backend ([../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md](../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md)).

## Recommended implementation order

### Phase 1 — Programme information (US-DASH-09, static)
1. [frontend/001-frontend-pdm-information-resources-pages.md](frontend-issues/001-frontend-pdm-information-resources-pages.md)

### Phase 2 — Public dashboard core (US-PUB-01+)
*(Issues to be added: shell, aggregates, filters, download.)*

## User story mapping

| User story | Backend issue(s) | Frontend issue(s) |
|------------|------------------|-------------------|
| US-DASH-09 PDM resources (public read) | — (static content; CMS deferred) | 001 |
| US-PUB-01 Public dashboard | TBD | TBD |

## Related

- Source content: [../../docs/pdm_public_info.md](../../docs/pdm_public_info.md)
- Deferred CMS (admin no-deploy edit): [../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md](../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md)
- Polishing backlog: [../require-polishing.md](../require-polishing.md)
