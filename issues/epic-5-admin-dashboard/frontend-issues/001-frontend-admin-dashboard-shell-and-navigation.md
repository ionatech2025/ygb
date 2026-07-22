## Objective

Replace the current `/admin/dashboard` → `ManageUsers` placeholder with a proper **Admin Dashboard shell**: sidebar/top navigation, route structure for dashboard home, users, collector tracker, and sync status. `ManageUsers` moves under `/admin/users`.

Satisfies routing foundation for US-DASH-01 through US-DASH-08. *(PDM public resources / US-DASH-09 live on Epic 6 public dashboard — no `/admin/content` route.)*

## Architectural Context

- **Components** (`src/adapters/primary/web/`):
  - `AdminDashboardHome.tsx` — placeholder stat/chart slots until issues `003`–`004`.
  - Extend `AdminLayout.tsx` with nav links: Dashboard, Users, Collector Tracker, Sync Status.

- **Routes** (`AppRouter.tsx`):
  - `/admin/dashboard` → `AdminDashboardHome`
  - `/admin/users` → `ManageUsers` (existing)
  - `/admin/collectors` → stub for issue `008`
  - `/admin/sync-status` → stub for issue `009`

- **Ports / Services**:
  - `IDashboardApiPort` stub (implemented in later issues).

## Technical Constraints & Clean Code

- Admin-only routes remain behind `ProtectedRoute allowedRoles={['ADMIN']}`.
- Mobile-responsive nav (reuse patterns from `CollectorLayout`).
- Each page file < 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: Admin nav renders all primary sections.
- [ ] Component test: `DATA_COLLECTOR` cannot access `/admin/dashboard` (redirect or 403).
- [ ] Route test: `/admin/users` renders existing `ManageUsers`.
- [ ] `/admin/dashboard` renders home shell with chart placeholder regions.
- [ ] Implement layout, routes, navigation.

## Blocked by

None — can start immediately.
