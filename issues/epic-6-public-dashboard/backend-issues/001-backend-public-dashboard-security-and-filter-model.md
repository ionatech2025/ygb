## Objective

Establish the **public dashboard backend foundation** (US-PUB-01, US-PUB-02): unauthenticated access to `/api/v1/public/dashboard/**`, a **`PublicDashboardFilter`** value object (eight dimensions — no Data Collector), filter-options for UI dropdowns, and a domain-level **PII guard** so public read paths never expose respondent or collector personal data.

This issue does **not** deliver chart/export endpoints (issues `002`–`003`); it defines the filter contract and security boundary reused by all public dashboard queries.

## Architectural Context

- **Core Domain** (`domain/`):
  - `PublicDashboardFilter` — district, sub-county, parish, age group, gender, form type, financial year period, date range; AND semantics; **excludes** `collectorId` (admin-only).
  - `PublicAnonymisedRecord` — read model for exports; columns explicitly whitelisted (no name, phone, collector fields).
  - `AnonymisationProjector` (domain service) — maps internal aggregates to public-safe DTOs; rejects any field on a PII deny-list.

- **Application Ports**:
  - Input (`api`): `GetPublicDashboardFilterOptionsQuery` — districts, sub-counties, parishes, age groups, genders, form types, FY periods (distinct values only).
  - Output (`spi`): extend or reuse `DashboardAggregationRepositoryPort` predicate builder with `PublicDashboardFilter` adapter.

- **Application Services**:
  - `GetPublicDashboardFilterOptionsService` — pure Java, wired in `UseCaseConfig`.

- **Adapters (REST)**:
  - `GET /api/v1/public/dashboard/filters/options` — no auth; response must not include collector names/IDs.
  - Spring Security: `permitAll()` on `/api/v1/public/dashboard/**` (and existing public location dataset).

- **Adapters (Security)**:
  - Integration test asserting unauthenticated `GET` → `200`, never `401`/`403` (TC-PUB-01-01).

> **Programme Area (deferred):** Originally in SRS PUB-03 / TC-PUB-02-01. Removed from MVP — no persisted submission column yet. Tracked in [require-polishing.md](../../require-polishing.md). Confirm mapping with product (e.g. PDM pillar / enterprise category) before wiring SQL.

## Technical Constraints & Clean Code

- **PII (TC-PUB-01-03):** Public filter-options and all subsequent public responses must never include respondent name, phone, or collector PII — enforce via `AnonymisationProjector` and contract tests on JSON shape.
- **Reuse:** Share aggregation SQL with admin where possible; map `PublicDashboardFilter` → internal `DashboardFilter` (without collector) in the application layer, not in controllers.
- **Thin controller:** Query param → filter mapper → use case only.

## Acceptance Criteria & TDD Checklist

- [x] Write **Domain Tests** for `PublicDashboardFilter` validation (invalid date range, AND semantics, rejects collectorId).
- [x] Write **Domain Tests** for `AnonymisationProjector` — strips/denies PII fields on sample internal records.
- [x] Write **Application Tests** with mocked SPI verifying filter-options service returns no collector fields.
- [x] Write **Controller Tests** (`@WebMvcTest`):
  - Unauthenticated `GET /api/v1/public/dashboard/filters/options` → `200 OK`.
  - Authenticated admin calling same endpoint → still `200` (public read).
  - Response JSON keys never match PII deny-list (`phone`, `fullName`, `collectorName`, etc.).
- [x] Configure Spring Security `permitAll` for public dashboard paths.
- [x] Implement filter value object, projector, filter-options endpoint, and security config.

## Blocked by

None — can start immediately. Reuses submission persistence and admin aggregation SPI from Epic 5 ([001](../../epic-5-admin-dashboard/backend-issues/001-backend-dashboard-aggregation-query-apis.md), [002](../../epic-5-admin-dashboard/backend-issues/002-backend-dashboard-filter-query-support.md)).
