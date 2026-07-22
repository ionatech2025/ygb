## Objective

Implement backend storage and APIs for **PDM programme information / resources** content (US-DASH-09): public read, admin write without code deployment.

## Architectural Context

- **Domain**:
  - `PdmContentPage` — `{ id, slug, title, bodyMarkdown, publishedAt, updatedBy }`.

- **Application Ports**:
  - Input: `GetPublishedContentQuery`, `ListContentPagesQuery`, `UpsertContentPageUseCase`, `PublishContentPageUseCase`.
  - Output: `ContentPageRepositoryPort`.

- **Persistence**:
  - Flyway migration: `content_pages` table.
  - `ContentPageRepositoryAdapter`.

- **REST**:
  - `GET /api/v1/content/{slug}` — **public** (`permitAll`) for published pages (TC-DASH-09-01).
  - `GET /api/v1/admin/content` — list all pages (`ADMIN`).
  - `PUT /api/v1/admin/content/{slug}` — create/update draft (`ADMIN`).
  - `POST /api/v1/admin/content/{slug}/publish` — publish (TC-DASH-09-02).

## Technical Constraints & Clean Code

- Store body as Markdown; sanitize on render in frontend.
- Version history out of scope for MVP — single published version per slug.
- Slugs: `programme-overview`, `budget-allocations`, `priorities`.

## Acceptance Criteria & TDD Checklist

- [ ] Domain tests: slug and title required.
- [ ] Application tests: publish sets `publishedAt`.
- [ ] Integration tests: public GET returns published content without auth.
- [ ] Controller tests: admin mutations blocked for non-admin.
- [ ] Implement persistence, services, controller.

## Blocked by

None — can start immediately (independent of dashboard aggregations).
