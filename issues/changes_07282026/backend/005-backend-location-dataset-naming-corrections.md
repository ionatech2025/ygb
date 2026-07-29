## Objective

Correct **inconsistent location labels** in the admin location dataset (districts, sub-counties, parishes, villages) — e.g. mixed numerals/letters (`Parish 1` vs `Parish I`), inconsistent capitalization — across **Kampala and Ntungamo** reference data.

Reference: [PDM_Tools_Change_Requests_07282026.md §1 item 6](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Architectural Context

- **Adapters (Persistence)**
  - New Flyway migration(s) updating `admin_locations` / mirrored submission location tables row-by-row.
  - No bulk heuristic — each incorrect label corrected per client reference document.

- **Application**
  - Location dataset endpoint (`GET /api/v1/locations/dataset`) returns corrected names; ETag must change so clients refresh cache.

## Technical Constraints

- Preserve **stable location IDs** — rename display labels only unless client requires ID merges (out of scope unless specified).
- Coordinate with Epic 4 offline cache invalidation (ETag bump).

## Acceptance Criteria & TDD Checklist

- [x] Migration script lists every corrected parish/sub-county/village with before/after comment.
- [x] Integration test: known typo (e.g. `Parish I` → `Parish 1`) reflected in dataset response.
- [x] Dataset ETag changes after migration.
- [x] No duplicate unique constraint violations after renames.

## Blocked by

None — can start immediately (content review with client team recommended before merge).

## Related frontend issue

- [frontend/002-frontend-location-dataset-label-display.md](../frontend/002-frontend-location-dataset-label-display.md)

## Client action required

Provide or approve the authoritative spelling list per division (Maryimmaculate / Evelyn review per change request doc §7).
