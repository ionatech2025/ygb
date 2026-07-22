# Epic 5 — Admin Dashboard

Issues for **US-DASH-01** through **US-DASH-09** (`docs/user_stories.md`).

## Recommended implementation order

### Phase 1 — Foundation
1. [backend/001-backend-dashboard-aggregation-query-apis.md](backend-issues/001-backend-dashboard-aggregation-query-apis.md)
2. [backend/002-backend-dashboard-filter-query-support.md](backend-issues/002-backend-dashboard-filter-query-support.md)
3. [frontend/001-frontend-admin-dashboard-shell-and-navigation.md](frontend-issues/001-frontend-admin-dashboard-shell-and-navigation.md)
4. [frontend/002-frontend-dashboard-filter-panel.md](frontend-issues/002-frontend-dashboard-filter-panel.md)

### Phase 2 — Dashboard core (US-DASH-01, 03)
5. [frontend/003-frontend-dashboard-summary-stat-cards.md](frontend-issues/003-frontend-dashboard-summary-stat-cards.md)
6. [frontend/004-frontend-dashboard-charts.md](frontend-issues/004-frontend-dashboard-charts.md)

### Phase 3 — Drill-down & export (US-DASH-04, 05)
7. [backend/003-backend-submission-list-and-detail-apis.md](backend-issues/003-backend-submission-list-and-detail-apis.md)
8. [frontend/005-frontend-submission-drill-down-views.md](frontend-issues/005-frontend-submission-drill-down-views.md)
9. [backend/004-backend-export-csv-excel-pdf.md](backend-issues/004-backend-export-csv-excel-pdf.md)
10. [frontend/006-frontend-export-actions-ui.md](frontend-issues/006-frontend-export-actions-ui.md)

### Phase 4 — Users & tracker (US-DASH-06, 07)
11. [backend/005-backend-user-lifecycle-and-collector-profile-apis.md](backend-issues/005-backend-user-lifecycle-and-collector-profile-apis.md)
12. [frontend/007-frontend-user-management-and-collector-profile.md](frontend-issues/007-frontend-user-management-and-collector-profile.md)
13. [backend/006-backend-collector-tracker-leaderboard-api.md](backend-issues/006-backend-collector-tracker-leaderboard-api.md)
14. [frontend/008-frontend-collector-tracker-leaderboard.md](frontend-issues/008-frontend-collector-tracker-leaderboard.md)

### Phase 5 — Sync status & public content (US-DASH-08, 09)
15. [backend/007-backend-admin-receipt-status-api.md](backend-issues/007-backend-admin-receipt-status-api.md)
16. [frontend/009-frontend-admin-sync-receipt-status-view.md](frontend-issues/009-frontend-admin-sync-receipt-status-view.md)
17. [backend/008-backend-pdm-content-cms-api.md](backend-issues/008-backend-pdm-content-cms-api.md)
18. [frontend/010-frontend-pdm-information-cms-pages.md](frontend-issues/010-frontend-pdm-information-cms-pages.md)

## User story mapping

| User story | Backend issue(s) | Frontend issue(s) |
|------------|------------------|-------------------|
| US-DASH-01 Charts | 001, 002 | 004 |
| US-DASH-02 Filters | 002 | 002 |
| US-DASH-03 Summary stats | 001, 002 | 003 |
| US-DASH-04 Drill-down | 003 | 005 |
| US-DASH-05 Export | 004 | 006 |
| US-DASH-06 User management | 005 | 007 |
| US-DASH-07 Collector tracker | 006 | 008 |
| US-DASH-08 Pending/sync queue | 007 | 009 |
| US-DASH-09 PDM resources | 008 | 010 |

## Related

- Polishing backlog: [../require-polishing.md](../require-polishing.md)
- Epic 4 location dataset (filter dropdowns): [../epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md](../epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md)
