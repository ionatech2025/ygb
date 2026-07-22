## Objective

Implement **public dashboard aggregation APIs** (US-PUB-01, US-PUB-03): anonymised summary statistics, chart series, and geographic heat-map data. All endpoints accept `PublicDashboardFilter` from issue `001` and return pre-aggregated JSON — never raw submission rows.

Minimum endpoints (per `backend/backend_docs/domain_arch_apis`):
1. `GET /api/v1/public/dashboard/summary` — total submissions, by form type, gender split, FY period counts.
2. `GET /api/v1/public/dashboard/charts/{chartType}` — `by-district`, `by-gender`, `by-age-group`, `trend`.
3. `GET /api/v1/public/dashboard/heatmap` — district/parish-level counts for map tooltip (TC-PUB-03-03).

## Architectural Context

- **Application Ports**:
  - Input (`api`): `GetPublicDashboardSummaryQuery`, `GetPublicDashboardChartQuery`, `GetPublicDashboardHeatmapQuery`.
  - Reuse `DashboardAggregationRepositoryPort` (Epic 5) via `PublicDashboardFilter` mapping.

- **Application Services**:
  - `PublicDashboardService` — composes aggregation SPI results through `AnonymisationProjector` before returning.

- **Adapters (REST)**:
  - `PublicDashboardController` — base path `/api/v1/public/dashboard`.
  - DTOs: `PublicSummaryResponseDto`, `PublicChartSeriesResponseDto`, `PublicHeatmapResponseDto`.
  - MapStruct mappers; no SQL in controller.

## Technical Constraints & Clean Code

- **Performance (NFR 5.1):** Aggregations < 2 s for 50,000 submissions — DB-side `GROUP BY`, same indexes as admin.
- **PII (TC-PUB-01-02, TC-PUB-01-03):** Integration tests scan response bodies for forbidden field names regardless of query params.
- **Consistency:** Filter intersection matches admin dashboard AND semantics (TC-PUB-02-03) for shared dimensions.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** with mocked aggregation SPI — service applies `PublicDashboardFilter` and passes output through projector.
- [ ] Write **Persistence Integration Tests** (Testcontainers) — combined gender + form type filter returns correct counts (TC-PUB-02-03).
- [ ] Write **Controller Tests** (`@WebMvcTest`):
  - Unauthenticated requests → `200 OK` with expected JSON shape (TC-PUB-01-01).
  - All chart types return non-empty series with seeded data.
  - Response payloads contain no PII fields (TC-PUB-01-03).
- [ ] Write **Contract test** (optional `@Tag("slow")`): heatmap entry includes district/parish id, label, count — no respondent identifiers.
- [ ] Implement use cases, controller, DTOs, and mappers.

## Blocked by

- Blocked by [epic-6-public-dashboard/backend-issues/001-backend-public-dashboard-security-and-filter-model.md](001-backend-public-dashboard-security-and-filter-model.md)
