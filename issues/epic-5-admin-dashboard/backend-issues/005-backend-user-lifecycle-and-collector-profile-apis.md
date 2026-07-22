## Objective

Extend Admin **user lifecycle APIs** beyond create/list (US-DASH-06). Admins must deactivate/reactivate Data Collectors, reset passwords, and retrieve a collector's submission history with filters.

> **Existing:** `UserController` already exposes `GET/POST /api/v1/admin/users/data-collectors` (create + list active). This issue adds deactivate, reactivate, password reset, and collector submission profile.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `DeactivateUserUseCase`, `ReactivateUserUseCase`, `ResetUserPasswordUseCase`, `GetCollectorSubmissionsQuery`.
  - Output (`spi`): Extend `UserRepositoryPort` with status flags and password update.

- **Domain**:
  - `UserStatus` (ACTIVE, DEACTIVATED) or boolean `active` flag on `User`.
  - Deactivated users rejected at login (online and offline token refresh).

- **REST** (`UserController` or `AdminUserController`):
  - `PATCH /api/v1/admin/users/{id}/deactivate`
  - `PATCH /api/v1/admin/users/{id}/reactivate`
  - `POST /api/v1/admin/users/{id}/reset-password` → returns generated temporary password or accepts admin-set password.
  - `GET /api/v1/admin/users/{id}/submissions?{filters}` — paginated list for collector profile (TC-DASH-06-03).

## Technical Constraints & Clean Code

- **Security:** All endpoints `ADMIN` only; password reset must hash via existing password encoder.
- **Offline login:** Deactivated account must fail cached offline login when refresh attempted (coordinate with polishing item P1).
- **File limits:** Extract controller if `UserController` exceeds 150 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Domain/application tests: deactivate prevents login use case path.
- [ ] Application test: password reset invalidates old hash (TC-DASH-06-02).
- [ ] Integration test: deactivated user login returns appropriate error (TC-DASH-06-01).
- [ ] Controller tests for each new endpoint (`403` for non-admin).
- [ ] Flyway migration if `active` column not yet present on users table.
- [ ] Implement use cases, persistence, REST.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/003-backend-submission-list-and-detail-apis.md](003-backend-submission-list-and-detail-apis.md)
