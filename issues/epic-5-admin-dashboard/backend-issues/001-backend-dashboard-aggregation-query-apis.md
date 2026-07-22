## Objective

Implement backend **read-only aggregation APIs** that power the Admin Dashboard charts and summary statistics (US-DASH-01, US-DASH-03). All endpoints accept a shared **`DashboardFilter`** (district, sub-county, parish, form type, date range, gender, age group, collector, financial year period) and return pre-aggregated JSON suitable for chart libraries — not raw submission rows.

Minimum aggregations:
1. **Submissions by district** — bar chart dataset.
2. **Gender split** — pie chart dataset.
3. **Submissions over time** — line chart dataset (bucketed by day or week).
4. **Submissions by form type** — summary + chart slice.
5. **Submissions by financial year period** — summary slice.

> Filter dimensions beyond district/parish (US-DASH-02) are defined here but fully wired in backend issue `002`; this issue delivers the query SPI and first aggregation endpoints.

## Architectural Context

- **Core Domain** (`domain/`):
  - `DashboardFilter` value object — validated filter criteria with AND semantics.
  - Read models: `DistrictCount`, `GenderSplit`, `TimeSeriesPoint`, `FormTypeCount`, `FinancialYearPeriodCount`.

- **Application Ports**:
  - Input (`api`): `GetDashboardAggregatesQuery` returning a `DashboardAggregates` record bundling all chart datasets for one filter set.
  - Output (`spi`): `DashboardAggregationRepositoryPort` with methods such as `countByDistrict(DashboardFilter)`, `countByGender(DashboardFilter)`, `countOverTime(DashboardFilter, Granularity)`, etc.

- **Application Services**:
  - `GetDashboardAggregatesService` — pure Java, wired in `UseCaseConfig`.

- **Adapters (Persistence)**:
  - JPA/native queries or criteria API on submission tables; index-friendly filters on `district_id`, `form_type`, `form_completed_at`, `financial_year_period`, `collector_id`.
  - `DashboardAggregationRepositoryAdapter`.

- **Adapters (REST)**:
  - `GET /api/v1/admin/dashboard/aggregates?{filterParams}` — `ADMIN` role only.
  - DTOs: `DashboardAggregatesResponseDto`, filter query param mapper.

## Technical Constraints & Clean Code

- **Performance (NFR 5.1):** Aggregations must complete in < 2 s for 50,000 submissions (DB-side `GROUP BY`, no in-memory full-table load).
- **Security:** `ADMIN` only; never accept `collectorId` override without admin role.
- **Thin controller:** Map query params → `DashboardFilter` → use case; no SQL in controller.
- **File limits:** Split repository if query methods exceed 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** for `DashboardFilter` validation (invalid date range, empty AND semantics).
- [ ] Write **Application Tests** with mocked `DashboardAggregationRepositoryPort` verifying `GetDashboardAggregatesService` assembles all datasets.
- [ ] Write **Persistence Integration Tests** (Testcontainers) with seeded submissions verifying correct counts per district/gender/form type.
- [ ] Write **Controller Tests** (`@WebMvcTest`) verifying:
  - `ADMIN` → `200 OK` with expected JSON shape.
  - `DATA_COLLECTOR` / unauthenticated → `403 Forbidden`.
- [ ] Implement repository queries, service, controller, and DTOs.

## Blocked by

None — can start immediately. Submission persistence from Epic 2 must contain filterable columns (district, gender, FY period, etc.).
