## Objective

Implement paginated **submission list** and **submission detail** read APIs for Admin drill-down (US-DASH-04). Admins must click a chart segment (e.g. district = Nakawa) and retrieve the underlying submission rows, then open one submission for full field-level detail.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `ListSubmissionsQuery`, `GetSubmissionDetailQuery`.
  - Output (`spi`): Extend `SubmissionRepositoryPort` with admin-scoped list/detail methods (paginated, filterable via `DashboardFilter` + optional drill-down dimension).

- **Application Services**:
  - `ListSubmissionsService`, `GetSubmissionDetailService`.

- **Adapters (REST)**:
  - `GET /api/v1/admin/submissions?page=&size=&{filters}` — summary rows (id, form type, respondent name, district, collector, timestamps, status).
  - `GET /api/v1/admin/submissions/{id}` — full polymorphic payload (BYP/IYP/LGO/PC fields), provenance, sync metadata.
  - Restrict to `ADMIN` role.

- **DTOs / Mappers**:
  - `SubmissionSummaryDto`, `SubmissionDetailDto` (MapStruct from domain/JPA).

## Technical Constraints & Clean Code

- **Pagination required:** Default page size 25; max 100. Required for 50k-record datasets.
- **No IDOR:** Detail endpoint verifies submission exists; admin role is sufficient (no per-collector scoping).
- **Controller < 150 lines:** Extract `AdminSubmissionController` if `SubmissionController` is already large.

## Acceptance Criteria & TDD Checklist

- [ ] Application tests: list query delegates to SPI with filter + pageable.
- [ ] Application tests: detail query returns full payload for each form type.
- [ ] Integration tests: list filtered by district returns only matching rows (TC-DASH-04-01).
- [ ] Controller tests: `ADMIN` list/detail `200`; `DATA_COLLECTOR` `403`.
- [ ] Implement services, repository methods, controller, DTOs.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/002-backend-dashboard-filter-query-support.md](002-backend-dashboard-filter-query-support.md)
