## Objective

Build the **Dashboard Filter Panel** (US-DASH-02): nine filter dimensions with AND logic, clear-all, and reactive URL/search-param sync so filters survive drill-down navigation (TC-DASH-04-03).

## Architectural Context

- **Domain** (`src/core/domain/`):
  - `dashboard-filter.model.ts` — mirrors backend `DashboardFilter` query params.

- **Components**:
  - `DashboardFilterPanel.tsx` — collapsible panel with selects/date pickers.
  - Reuse `CascadingLocationSelector` for District → Sub-county → Parish (admin variant, no respondent coupling).

- **Store** (`src/core/store/`):
  - `useDashboardFilterStore.ts` — Zustand store; exposes `filter`, `setFilter`, `clearAll`.

- **Secondary Adapter**:
  - `dashboard-api.adapter.ts` — builds query string from filter state.

## Technical Constraints & Clean Code

- AND semantics: each active filter narrows results.
- District change clears sub-county and parish selections.
- Filter state stored in URL (`?district=...&formType=BYP`) for shareable admin links.

## Acceptance Criteria & TDD Checklist

- [x] Component test: all nine dimensions render (TC-DASH-02-01).
- [x] Unit test: combined filters serialize to correct query string (TC-DASH-02-03).
- [x] Component test: Clear all resets to empty filter (TC-DASH-02-04).
- [x] Integration test: changing district triggers sub-county repopulation from cached locations.
- [x] Implement panel, store, URL sync.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/001-frontend-admin-dashboard-shell-and-navigation.md](001-frontend-admin-dashboard-shell-and-navigation.md)
- Blocked by [epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md](../../epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md) (location dataset for cascading admin filters)
