## Objective

~~Implement backend storage and APIs for **PDM programme information / resources** content (US-DASH-09): public read, admin write without code deployment.~~

**Status: DEFERRED (post-launch / on client request)**

US-DASH-09 public read is satisfied in **Epic 6** using static Markdown from [`docs/pdm_public_info.md`](../../../docs/pdm_public_info.md) — see [epic-6-public-dashboard/frontend-issues/001-frontend-pdm-information-resources-pages.md](../../epic-6-public-dashboard/frontend-issues/001-frontend-pdm-information-resources-pages.md).

Admin no-deploy editing (TC-DASH-09-02) is accepted as out of scope for launch; content updates require a frontend deploy until this issue is revived.

## Original scope (if revived)

- **Domain**: `PdmContentPage` — `{ id, slug, title, bodyMarkdown, publishedAt, updatedBy }`.
- **REST**: `GET /api/v1/content/{slug}` (public), admin list/upsert/publish.
- **Slugs**: `programme-overview`, `budget-allocations`, `priorities`.

## Acceptance Criteria & TDD Checklist

- [ ] ~~Domain tests: slug and title required.~~ *(deferred)*
- [ ] ~~Application tests: publish sets `publishedAt`.~~ *(deferred)*
- [ ] ~~Integration tests: public GET returns published content without auth.~~ *(deferred)*
- [ ] ~~Controller tests: admin mutations blocked for non-admin.~~ *(deferred)*
- [ ] ~~Implement persistence, services, controller.~~ *(deferred)*

## Blocked by

None — was independent; **superseded by Epic 6 static approach**.
