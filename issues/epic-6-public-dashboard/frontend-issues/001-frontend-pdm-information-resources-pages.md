## Objective

Implement **PDM Information / Resources** on the public dashboard (US-DASH-09): read-only pages for programme context, budget allocations, and priorities — **without authentication** and **without a backend CMS**.

Content is sourced from the single Markdown file [`docs/pdm_public_info.md`](../../../docs/pdm_public_info.md). Updates ship via frontend deploy (TC-DASH-09-02 admin no-deploy edit is **out of scope** for launch; see deferred [008-backend-pdm-content-cms-api.md](../../epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md)).

## Architectural Context

- **Public routes** (no auth, `permitAll`-equivalent — no API calls):
  - `/resources` — index linking to three topic pages.
  - `/resources/programme-overview` — About PDM, 7 Pillars, implementation structure, progress highlights.
  - `/resources/budget-allocations` — Financing and budget allocation tables.
  - `/resources/priorities` — Enterprises, support provided, complementary programmes, contacts & further reading.

- **Components** (`src/adapters/primary/web/public/`):
  - `PdmResourcesIndexPage.tsx` — card/list navigation to the three slugs.
  - `PdmResourceDetailPage.tsx` — renders a section slice of the Markdown source with heading anchor nav.
  - Shared `MarkdownContent.tsx` — sanitize + render (XSS-safe).

- **Content wiring**:
  - Import or build-time bundle `pdm_public_info.md` (or a generated `pdmPublicInfoSections.ts` split map).
  - Section boundaries defined once in a config map (`slug → heading range`), not duplicated in three files.

- **No ports/adapters** — no `IContentApiPort`; static only.

## Technical Constraints & Clean Code

- Sanitize rendered Markdown (XSS-safe).
- Public pages accessible without login (TC-DASH-09-01).
- Link from public dashboard shell nav (“About PDM” / “Resources”) — wired in [002-frontend-public-dashboard-shell-and-navigation.md](002-frontend-public-dashboard-shell-and-navigation.md).
- Do **not** add `/admin/content` or admin CMS UI (supersedes Epic 5 issue `010`).

## Acceptance Criteria & TDD Checklist

- [ ] Component test: resource index renders three links without auth wrapper.
- [ ] Component test: `/resources/programme-overview` renders expected heading and body excerpt from source doc.
- [ ] Component test: Markdown renderer strips/neutralizes unsafe HTML/script content.
- [ ] Route test: unauthenticated visitor can load all `/resources/*` routes.
- [ ] Implement index + detail pages, section split config, routes in `AppRouter`.

## Supersedes

- [epic-5-admin-dashboard/frontend-issues/010-frontend-pdm-information-cms-pages.md](../../epic-5-admin-dashboard/frontend-issues/010-frontend-pdm-information-cms-pages.md) — cancelled; CMS + admin editor deferred.

## Blocked by

None — can start immediately (no backend dependency).
