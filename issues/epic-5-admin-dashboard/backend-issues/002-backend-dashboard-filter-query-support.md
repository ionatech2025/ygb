## Objective

Extend dashboard aggregation queries to support **all nine filter dimensions** from US-DASH-02 with **AND logic**: District, Sub-county, Parish, Form Type, Date Range, Gender, Age Group, Data Collector, Financial Year Period.

This issue completes the backend filter contract started in issue `001` so every chart and summary stat respects the same filter object.

## Architectural Context

- **Core Domain**:
  - Extend `DashboardFilter` with sub-county, parish, age group, collector ID fields.
  - `DashboardFilter.empty()` factory for unfiltered queries.

- **Application / Persistence**:
  - Extend `DashboardAggregationRepositoryPort` query builders to apply all dimensions.
  - Cascading location filters: parish implies sub-county/district; validate consistency in domain or reject invalid combinations.

- **REST**:
  - Document OpenAPI-style query param list on `GET /api/v1/admin/dashboard/aggregates`.
  - Optional: `GET /api/v1/admin/dashboard/filters/options` returning distinct collectors, districts, etc. for populating UI dropdowns.

## Technical Constraints & Clean Code

- **AND semantics:** Multiple filters intersect; clearing a filter removes that predicate only.
- **Location joins:** Filter by parish via stored location IDs on submission/respondent records (not free text).
- **Indexes:** Add Flyway migration if new composite indexes are needed for filter performance.

## Acceptance Criteria & TDD Checklist

- [ ] Domain test: combined filter `District=A AND FormType=BYP` produces correct SPI predicate (TC-DASH-02-03).
- [ ] Integration test: filter by FY period `JAN_JUN_2026` excludes other periods (TC-DASH-02-02).
- [ ] Integration test: `DashboardFilter.empty()` returns full dataset count (TC-DASH-02-04).
- [ ] Controller test: all nine query params accepted and forwarded to use case (TC-DASH-02-01).
- [ ] Implement filter options endpoint if included in scope.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/001-backend-dashboard-aggregation-query-apis.md](001-backend-dashboard-aggregation-query-apis.md)
