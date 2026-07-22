## Objective

Fix missing parish/village options for **Kawempe**, **Makindye**, and **Rubaga** divisions in Kampala by flattening `subdivisions` in the source JSON into their parent division. Subdivisions are **not** exposed as a hierarchy level in the app.

## Background

`kampala_location_data.json` mirrors the 2010 PDF structure: some divisions list parishes directly; others nest parishes under `subdivisions` (e.g. Kawempe North/South, Makerere University).

`build-admin-locations.mjs` originally read only `division.parishes`, so three of five Kampala divisions had **zero parishes** in `admin_locations` / `locations`. Admin dashboard and collector UIs showed empty parish dropdowns after selecting those divisions.

## Architectural Context

- **Source data** (`backend/src/main/resources/location/source/kampala_location_data.json`):
  - **Decision:** Keep `subdivisions` in JSON as archival fidelity to the PDF; flatten only in the build parser (no JSON restructure).

- **Build script** (`backend/scripts/build-admin-locations.mjs`):
  - `parishesForKampalaDivision()` merges `division.parishes` + all `subdivisions[].parishes`.
  - **Decision:** Fail the build if flattening produces duplicate parish names within the same division (prevents silent UUID collisions).
  - Subdivision names are ignored for ID generation; stable UUIDs use district + division + parish + village only.
  - Regenerates `admin-locations-dataset.json` and `V12__Flatten_Kampala_Subdivision_Parishes.sql` (delta for existing DBs).

- **Persistence**:
  - V12 inserts ~552 missing Kampala rows into `admin_locations` and mirrors them into `locations`.
  - V9 is **not** rewritten (Flyway checksum); fresh installs run V9 then V12.

- **No UI changes** required — hierarchy remains District → Division → Parish → Village.

## Technical Constraints & Clean Code

- No duplicate parish names within a division after flattening (verified in source JSON).
- Ntungamo parser unchanged (`subcounties` → `parishes` already flat).
- **Decision:** No explicit PWA cache-bust for this fix — ETag refresh on next online sync is sufficient; pre-production with no collector submissions yet.

## Acceptance Criteria & TDD Checklist

- [x] Build script flattens Kampala subdivisions into division-level parishes.
- [x] V12 migration adds missing parishes/villages and mirrors to `locations`.
- [x] Integration test: Kawempe and Rubaga divisions return parish options.
- [ ] Manual: admin dashboard parish dropdown populated for Kawempe / Makindye / Rubaga.
- [ ] Manual: collector cascading selector shows parishes for same divisions after cache refresh.

## Blocked by

- None (extends [009-backend-location-dataset-endpoint.md](009-backend-location-dataset-endpoint.md)).
