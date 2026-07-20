## Objective

Implement the offline-capable Uganda administrative location dataset on the frontend, enabling the cascading District → Sub-county → Parish → Village dropdowns (US-FORM-07 / US-SYNC-05) to work fully offline. This requires:

1. Fetching the location dataset from the backend endpoint (`GET /api/v1/locations/dataset`, built in issue `009`) on app load and on every connectivity restoration.
2. Caching the dataset in **IndexedDB** (via Dexie, in the existing `YGBSubmissionDatabase` or a new `YGBLocationDatabase`) so it is available completely offline after the first fetch.
3. A **`LocationService`** that reads from the local cache first (offline-first), falling back to a network fetch only when no local data exists.
4. A **`useCascadingLocation`** React hook that exposes reactive lists of districts, sub-counties, parishes, and villages, each filtered by the parent selection.
5. A **`CascadingLocationSelector`** React component rendering four dropdowns wired to the hook, usable in any of the 4 survey forms.

### Location Data Flow

```
On app load (online)
  → fetch /api/v1/locations/dataset
  → store in IndexedDB adminLocations table
  → serve from cache for all UI usage

On app load (offline, or cache hit)
  → read from IndexedDB directly
  → serve four-level cascading dropdowns

On reconnect (background)
  → re-fetch with ETag (If-None-Match header)
  → update cache only on 200 OK (skip on 304 Not Modified)
```

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - `admin-location.model.ts` — `AdminLocation` type: `{ id: string; name: string; parentId: string | null; level: 'DISTRICT' | 'SUBCOUNTY' | 'PARISH' | 'VILLAGE' }`.

- **Frontend Ports** (`src/ports/`):
  - `location-repository.port.ts` — `ILocationRepositoryPort` with:
    - `save(locations: AdminLocation[]): Promise<void>`
    - `findByLevel(level: AdminLocation['level']): Promise<AdminLocation[]>`
    - `findByParentId(parentId: string): Promise<AdminLocation[]>`
    - `hasData(): Promise<boolean>`

- **Frontend Secondary Adapters** (`src/adapters/secondary/`):
  - `location-repository.adapter.ts` — Dexie-backed implementation of `ILocationRepositoryPort`. Stores all locations in an `adminLocations` table with index on `level` and `parentId`.
  - `location-api.adapter.ts` — fetches from `/api/v1/locations/dataset` using `fetch`. Sends `If-None-Match` header when a cached ETag is available (stored in `localStorage`). Returns `null` on `304 Not Modified` (no update needed).

- **Frontend Core** (`src/core/`):
  - `LocationService.ts` — coordinates `ILocationRepositoryPort` and `location-api.adapter.ts`. Exposes `async ensureLoaded(): Promise<void>`. Called on app boot and on `window.online` events (via `useSyncStore`).

- **Frontend Hooks** (`src/core/hooks/` or colocated with component):
  - `useCascadingLocation.ts` — React hook returning `{ districts, subcounties, parishes, villages, selected, setDistrict, setSubcounty, setParish, setVillage }`. Reads from `ILocationRepositoryPort`. Clears dependent selections when a parent changes.

- **Frontend Primary Adapters — Components** (`src/adapters/primary/web/components/`):
  - `CascadingLocationSelector.tsx` — renders four `<select>` elements. Accepts optional `onLocationChange` callback. Shows a loading skeleton while data is being fetched. Displays a warning banner if no data is available (neither cached nor online).

## Technical Constraints & Clean Code

- **Offline-first**: `LocationService.ensureLoaded()` must check `ILocationRepositoryPort.hasData()` first; only if it returns `false` does it fetch from the network.
- **No free-text input**: `CascadingLocationSelector` must only render `<select>` elements — no `<input type="text">` for location fields.
- **Parent change clears children**: When District changes, Sub-county, Parish, and Village selections reset. When Sub-county changes, Parish and Village reset. When Parish changes, Village resets.
- **File limits**: Keep each file under 200 lines. `CascadingLocationSelector.tsx` may use a local sub-component for each level if needed.
- **ETag persistence**: Store the last received ETag in `localStorage` (key: `'ygb:location-etag'`) to enable conditional requests.

## Acceptance Criteria & TDD Checklist

- [ ] After first online load, the `adminLocations` IndexedDB table is populated with all Uganda districts/sub-counties/parishes/villages.
- [ ] Going offline after the first load: all four dropdown levels still populate and filter correctly.
- [ ] On reconnect, a new fetch is attempted with the stored `If-None-Match` ETag. If unchanged, the cache is not overwritten.
- [ ] Selecting a District populates Sub-county only for that District.
- [ ] Changing District resets Sub-county, Parish, and Village to empty.
- [ ] `CascadingLocationSelector` shows a loading state while `LocationService.ensureLoaded()` is running.
- [ ] No `<input>` element accepts raw text for any location level.
- [ ] `CascadingLocationSelector` is integrated into `PDMSurveyView.tsx` for the respondent location section.

## Blocked by

- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md)
- Blocked by [epic-4-offline-sync/backend-issues/009-backend-location-dataset-endpoint.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/backend-issues/009-backend-location-dataset-endpoint.md)
