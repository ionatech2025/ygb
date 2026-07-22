## Objective

Implement the **Data Collector Tracker** aggregation API (US-DASH-07): a leaderboard of all collectors with cumulative submission counts, filterable by collector, form type, district, date range, and financial year period. Selecting a collector returns breakdown by form type and district.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `GetCollectorLeaderboardQuery`, `GetCollectorBreakdownQuery`.
  - Output (`spi`): `CollectorTrackerRepositoryPort` with grouped count queries.

- **Read models**:
  - `CollectorLeaderboardEntry` — `{ collectorId, fullName, totalCount }`.
  - `CollectorBreakdown` — `{ byFormType: [...], byDistrict: [...] }`.

- **REST**:
  - `GET /api/v1/admin/collectors/leaderboard?{filters}` — sorted descending by count (TC-DASH-07-01).
  - `GET /api/v1/admin/collectors/{id}/breakdown?{filters}` — drill-down (TC-DASH-07-03).

## Technical Constraints & Clean Code

- Reuse `DashboardFilter` minus collector dimension for leaderboard; apply collector filter when drilling into one row.
- Default sort: `totalCount DESC`, then `fullName ASC`.

## Acceptance Criteria & TDD Checklist

- [x] Integration test: leaderboard counts match seeded submissions per collector.
- [x] Integration test: FY period filter recalculates counts (TC-DASH-07-02).
- [x] Application test: breakdown query returns form type and district slices.
- [x] Controller tests: `ADMIN` only access.
- [x] Implement repository, services, controller, DTOs.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/002-backend-dashboard-filter-query-support.md](002-backend-dashboard-filter-query-support.md)
