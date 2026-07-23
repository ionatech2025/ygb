## Objective

Implement **public dashboard visualisations** (US-PUB-03): bar chart (submissions by district), pie charts (gender split, age group distribution), line graph (submission trends over time), and **geographic heat map** with district/parish tooltips (TC-PUB-03-01 through TC-PUB-03-03).

Charts consume public aggregation APIs and respect active filters — no client-side aggregation of raw rows.

## Architectural Context

- **Components** (`src/adapters/primary/web/public/`):
  - `PublicDashboardCharts.tsx` — responsive grid layout.
  - `PublicSubmissionsByDistrictChart.tsx`, `PublicGenderSplitChart.tsx`, `PublicAgeGroupChart.tsx`, `PublicSubmissionsOverTimeChart.tsx`.
  - `PublicGeographicHeatmap.tsx` — map layer with hover/tap tooltip showing count (TC-PUB-03-03).
  - Prefer reusing ECharts patterns from admin `DashboardCharts` where chart types overlap.

- **Ports / Adapters**:
  - `IPublicDashboardApiPort.fetchChart(chartType, filter)`, `fetchHeatmap(filter)`.

## Technical Constraints & Clean Code

- **Performance (NFR 5.1):** Render within 4 s — rely on server-side aggregation (TC-DASH-01-03 pattern).
- **Filter sync (TC-PUB-03-02):** All chart types update when filters change.
- **No drill-down to individuals:** Public charts do not link to submission detail (unlike admin issue `005`).
- Responsive: stack on mobile; accessible titles and aria labels.

## Acceptance Criteria & TDD Checklist

- [x] Component test: bar, pie(s), line, and heat map render with mock data (TC-PUB-03-01).
- [x] Component test: filter change updates chart data props / re-fetch (TC-PUB-03-02).
- [x] Component test: heat map tooltip shows count for a region (TC-PUB-03-03).
- [x] Adapter test: maps `bucketStart` → `date` for trend series if backend uses admin naming.
- [x] Implement charts, heat map, and API wiring.

## Blocked by

- Blocked by [frontend-issues/004-frontend-public-dashboard-summary-stat-cards.md](004-frontend-public-dashboard-summary-stat-cards.md)
- Blocked by [backend-issues/002-backend-public-dashboard-aggregation-apis.md](../backend-issues/002-backend-public-dashboard-aggregation-apis.md)
