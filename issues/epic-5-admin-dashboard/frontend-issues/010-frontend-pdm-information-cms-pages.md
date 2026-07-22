## Objective

~~Implement **PDM Information / Resources** pages (US-DASH-09): public read-only pages and Admin CMS editor for programme content without code deployment.~~

**Status: CANCELLED — superseded by Epic 6**

Public PDM information is implemented as **static Markdown** on the public dashboard, not as an admin CMS. See:

- [epic-6-public-dashboard/frontend-issues/001-frontend-pdm-information-resources-pages.md](../../epic-6-public-dashboard/frontend-issues/001-frontend-pdm-information-resources-pages.md)
- Source: [`docs/pdm_public_info.md`](../../../docs/pdm_public_info.md)

Backend CMS API ([008-backend-pdm-content-cms-api.md](../backend-issues/008-backend-pdm-content-cms-api.md)) is **deferred**.

## Acceptance Criteria & TDD Checklist

- [ ] ~~Component test: public page renders without auth wrapper.~~ *(moved to Epic 6 001)*
- [ ] ~~Component test: admin editor save + publish calls correct API sequence.~~ *(deferred with backend 008)*
- [ ] ~~Route test: `/resources/programme-overview` loads published body.~~ *(moved to Epic 6 001)*
- [ ] ~~Implement public + admin pages, adapter, routes in `AppRouter`.~~ *(cancelled)*

## Blocked by

~~Blocked by [008-backend-pdm-content-cms-api.md](../backend-issues/008-backend-pdm-content-cms-api.md)~~ — no longer applicable.
