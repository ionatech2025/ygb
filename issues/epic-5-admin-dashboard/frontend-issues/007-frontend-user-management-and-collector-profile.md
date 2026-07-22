## Objective

Enhance **Manage Users** for full US-DASH-06: deactivate/reactivate collectors, reset passwords, and open a **collector profile** showing their submissions with filters.

> **Existing:** Create collector + list active collectors (`ManageUsers.tsx`, `UserController`).

## Architectural Context

- **Components**:
  - Extend `ManageUsers.tsx` with row actions: Deactivate, Reactivate, Reset Password.
  - `CollectorProfilePage.tsx` — `/admin/users/:id` with submission list + filters (form type, district, date, FY period).

- **Ports**:
  - Extend `IUserAdminPort` with lifecycle methods; add `getCollectorSubmissions(id, filter)`.

- **Secondary Adapter**:
  - Extend `http-user.adapter.ts` for PATCH/POST lifecycle endpoints.

## Technical Constraints & Clean Code

- Confirm destructive actions (deactivate, reset password) with modal dialog.
- Display generated temporary password once after reset (copy-to-clipboard).
- Deactivated users shown in separate section or with visual badge.

## Acceptance Criteria & TDD Checklist

- [x] Component test: deactivate button calls API and refreshes list (TC-DASH-06-01).
- [x] Component test: reset password shows success with new password hint (TC-DASH-06-02).
- [x] Component test: collector profile lists submissions with filter controls (TC-DASH-06-03).
- [x] Adapter tests for new HTTP methods.
- [x] Implement UI and adapter extensions.

## Blocked by

- Blocked by [epic-5-admin-dashboard/frontend-issues/001-frontend-admin-dashboard-shell-and-navigation.md](001-frontend-admin-dashboard-shell-and-navigation.md)
- Blocked by [epic-5-admin-dashboard/backend-issues/005-backend-user-lifecycle-and-collector-profile-apis.md](../backend-issues/005-backend-user-lifecycle-and-collector-profile-apis.md)
