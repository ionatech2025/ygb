## Objective

Let an authenticated **Data Collector** retrieve a paginated history of **their own** PDM survey submissions (BYP, IYP, LGO, PC) without contacting Admin. Complements US-FORM-13 (today’s count only) with a durable list of what they have submitted.

## Architectural Context

- **Application**: Reuse existing `GetCollectorSubmissionsQuery` / `GetCollectorSubmissionsService` (already scopes `DashboardFilter.collectorId` and rejects non-collector accounts). Do not duplicate list logic.
- **Adapters (in/rest)**: Add `GET /api/v1/submissions/mine` on `SubmissionController` (or a thin sibling controller if `SubmissionController` would exceed size limits). Collector id comes from the JWT principal — never from a path/query spoofable id.
- **DTOs / Mappers**: Reuse `SubmissionPageResponseDto` / `AdminSubmissionRestMapper.toResponse` (same summary shape as admin list: form type, respondent name, district, timestamps, status, FY period).
- **Security**: `DATA_COLLECTOR` only. Admin must not use this endpoint to browse another collector (they already have `GET /api/v1/admin/users/{id}/submissions`).

## Technical Constraints & Clean Code

- File limits: keep `SubmissionController` thin; extract if it would exceed ~150 lines.
- Pagination: default page 0, size 25, max 100 (reuse `PageRequest.of`).
- Optional filters: `formType`, `dateFrom`, `dateTo`, `financialYearPeriod` via existing `DashboardFilterRequestMapper`.
- Controllers contain no query logic — call `GetCollectorSubmissionsQuery.getSubmissions(principalId, filter, pageRequest)`.

## Acceptance Criteria & TDD Checklist

- [x] Controller test: `DATA_COLLECTOR` `GET /api/v1/submissions/mine` returns 200 with items scoped to the principal id.
- [x] Controller test: unauthenticated → 401/403; `ADMIN` → 403.
- [x] Controller test: `page`/`size` and optional `formType` are forwarded into the use case (collector id forced from principal, not query).
- [x] Security matcher: `GET /api/v1/submissions/mine` is `hasRole("DATA_COLLECTOR")`.
- [x] Implement the endpoint with existing application service + mapper.
- [x] Controller test: `DATA_COLLECTOR` `GET /api/v1/submissions/mine/breakdown` returns form-type and district aggregates for the principal.
- [x] Security matcher: `GET /api/v1/submissions/mine/breakdown` is `hasRole("DATA_COLLECTOR")`.

## Blocked by

None — `GetCollectorSubmissionsQuery` already exists.

## Related

- US-FORM-13 (today count) · Admin [003-backend-submission-list-and-detail-apis](../epic-5-admin-dashboard/backend-issues/003-backend-submission-list-and-detail-apis.md)
