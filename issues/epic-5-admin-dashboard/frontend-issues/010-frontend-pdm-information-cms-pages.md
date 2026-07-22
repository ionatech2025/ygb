## Objective

Implement **PDM Information / Resources** pages (US-DASH-09): public read-only pages and Admin CMS editor for programme content without code deployment.

## Architectural Context

- **Public routes** (no auth):
  - `/resources` — index of published pages.
  - `/resources/:slug` — rendered Markdown content.

- **Admin routes**:
  - `/admin/content` — list pages, edit Markdown, publish.

- **Components**:
  - `PdmResourcesPage.tsx`, `PdmResourceDetailPage.tsx` (public).
  - `ContentEditorPage.tsx` (admin) — Markdown textarea + preview.

- **Ports**:
  - `IContentApiPort` — public GET + admin CRUD/publish.

## Technical Constraints & Clean Code

- Sanitize rendered Markdown (XSS-safe).
- Public pages accessible without login (TC-DASH-09-01).
- Publish updates live content immediately (TC-DASH-09-02).

## Acceptance Criteria & TDD Checklist

- [ ] Component test: public page renders without auth wrapper.
- [ ] Component test: admin editor save + publish calls correct API sequence.
- [ ] Route test: `/resources/programme-overview` loads published body.
- [ ] Implement public + admin pages, adapter, routes in `AppRouter`.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/008-backend-pdm-content-cms-api.md](../backend-issues/008-backend-pdm-content-cms-api.md)
