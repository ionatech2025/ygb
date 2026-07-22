## Objective

Replace the dual-table location model (`admin_locations` + mirrored `locations`) with a **single source of truth** in `admin_locations`. Remove V11 mirror migration once submission FKs and dashboard queries read from one table.

## Background

Today two PostgreSQL tables hold overlapping hierarchies with different UUIDs:

| Table | Used by |
|-------|---------|
| `admin_locations` | `GET /api/v1/locations/dataset`, collector IndexedDB cache |
| `locations` | Submission FKs, dashboard filter options, hierarchy validation |

V11 mirrors `admin_locations` → `locations` as a bridge. This issue removes that duplication.

## Architectural Context

- **Persistence**:
  - Flyway migration: repoint submission location FKs from `locations(id)` to `admin_locations(id)`.
  - Update native SQL in `DashboardFilterOptionsJpaRepository`, `DashboardAggregationJpaRepository`, `LocationHierarchyRepositoryAdapter`, and any submission export/join queries: `locations` → `admin_locations`, column `type` → `level`.
  - Drop `locations` table and remove V11 mirror script from future greenfield installs (squash or superseding migration).

- **Domain / Application**:
  - Ensure `DashboardFilterHierarchyValidator` and location-not-found errors use the same repository as collector dataset.

- **REST**:
  - No API contract change expected; UUIDs remain Kampala/Ntungamo from V9.

## Technical Constraints & Clean Code

- Zero downtime on existing submissions: migrate FKs only where IDs exist in `admin_locations`.
- Integration tests must use Flyway V9 + consolidation migration (not V11 mirror).
- Regenerate `build-admin-locations.mjs` output if seed scripts reference `locations`.

## Acceptance Criteria & TDD Checklist

- [ ] Migration test: submissions with Kampala/Ntungamo parish IDs validate successfully after consolidation.
- [ ] Integration test: dashboard filter options return districts from `admin_locations` only.
- [ ] Integration test: aggregation queries with district/sub-county/parish filters still return correct counts.
- [ ] Remove V11 mirror migration (or replace with one-time FK migration only).
- [ ] Document single-table model in epic README or migration comment.

## Blocked by

- Blocked by V11 bridge shipping (short-term fix in epic-5 admin dashboard work).

## Related

- [epic-4-offline-sync/backend-issues/009-backend-location-dataset-endpoint.md](009-backend-location-dataset-endpoint.md)
- [epic-5-admin-dashboard/backend-issues/002-backend-dashboard-filter-query-support.md](../../epic-5-admin-dashboard/backend-issues/002-backend-dashboard-filter-query-support.md)
