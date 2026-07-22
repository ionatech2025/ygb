## Objective

Build the **Public Dashboard Filter Panel** (US-PUB-02, US-PUB-05): nine filter dimensions with AND logic, real-time API refresh, and **URL query-param sync** so filtered views are shareable (TC-PUB-05-01 through TC-PUB-05-03).

Public filters mirror admin behaviour but **exclude Data Collector** and include **Programme Area** per SRS PUB-03.

## Architectural Context

- **Domain** (`src/core/domain/`):
  - `public-dashboard-filter.model.ts` — mirrors backend `PublicDashboardFilter` query params.

- **Components**:
  - `PublicDashboardFilterPanel.tsx` — adapt from admin `DashboardFilterPanel`; nine dimensions.
  - Reuse `CascadingLocationSelector` with public location dataset (`GET /api/v1/locations/dataset`).

- **Store**:
  - `usePublicDashboardFilterStore.ts` — Zustand; `filter`, `setFilter`, `clearAll`.
  - `usePublicDashboardFilterUrlSync.ts` — sync filter ↔ URL on `/dashboard` only.

- **Ports / Adapters**:
  - `IPublicDashboardApiPort.fetchFilterOptions()` → `GET /api/v1/public/dashboard/filters/options`.
  - `HttpPublicDashboardAdapter`.

## Technical Constraints & Clean Code

- **Real-time (TC-PUB-02-02):** Filter change triggers debounced re-fetch of summary/charts (issues `004`–`005`) within a few seconds — no full page reload.
- **URL share (TC-PUB-05-02):** Copy URL with `?district=...&gender=...` reproduces filters on cold load in incognito.
- District change clears sub-county and parish.
- Programme Area: render disabled/empty state until backend options exist (issue backend `001` note).

## Acceptance Criteria & TDD Checklist

- [ ] Component test: all nine dimensions render (TC-PUB-02-01).
- [ ] Unit test: combined filters serialize to correct query string (TC-PUB-02-03).
- [ ] Component test: Clear all resets filter and URL params.
- [ ] Component test: loading saved URL applies filters on mount (TC-PUB-05-02).
- [ ] Adapter test: filter options request hits public endpoint without auth header.
- [ ] Implement panel, store, URL sync, and API adapter.

## Blocked by

- Blocked by [frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md](002-frontend-public-dashboard-shell-and-navigation.md)
- Blocked by [backend-issues/001-backend-public-dashboard-security-and-filter-model.md](../backend-issues/001-backend-public-dashboard-security-and-filter-model.md)
