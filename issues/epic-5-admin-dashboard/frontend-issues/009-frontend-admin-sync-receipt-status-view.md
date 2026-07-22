## Objective

Build the Admin **Sync Receipt Status** view (US-DASH-08): server-side SYNCED/FLAGGED/DUPLICATE counts by collector, with stale-collector highlighting. Clearly label that device PENDING queues are not visible server-side.

## Architectural Context

- **Components**:
  - `AdminSyncStatusPage.tsx` — `/admin/sync-status`.
  - `ReceiptStatusSummary.tsx`, `CollectorReceiptTable.tsx`.

- **Ports**:
  - `IAdminSyncStatusApiPort.fetchReceiptStatus()`.

## Technical Constraints & Clean Code

- Info banner explaining client-side PENDING limitation (link to `issues/require-polishing.md` rationale).
- Stale collectors (> 48 h since last server receipt) visually flagged (TC-DASH-08-02).
- Counts match API totals (TC-DASH-08-01).

## Acceptance Criteria & TDD Checklist

- [x] Component test: renders status counts from mock API.
- [x] Component test: stale collector row has warning styling.
- [x] Component test: info banner mentions device pending is client-side only.
- [x] Implement page and adapter.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/001-frontend-admin-dashboard-shell-and-navigation.md](001-frontend-admin-dashboard-shell-and-navigation.md)
- Blocked by [epic-5-admin-dashboard/backend-issues/007-backend-admin-receipt-status-api.md](../backend-issues/007-backend-admin-receipt-status-api.md)
