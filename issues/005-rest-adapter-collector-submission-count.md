## Objective

Implement the query use case and endpoint allowing a Data Collector to view their own submission count on a specific date.

## Architectural Context

- **Application Ports**:
  - Input Port (`api`): `GetCollectorSubmissionCountQuery` use case.
  - Output Port (`spi`): `SubmissionQueryRepositoryPort` for querying counts.
- **Application Services**:
  - `GetCollectorSubmissionCountService` implementing the query use case.
- **Adapters**:
  - REST Controller: `SubmissionController` exposing `GET /submissions/my-count?date={today}`.
  - Persistence Adapter: Extend to implement `SubmissionQueryRepositoryPort`.

## Technical Constraints & Clean Code

- **Security Gate**: Restrict endpoint strictly to `DATA_COLLECTOR` role. The query must automatically scope to the authenticated user's ID, avoiding parameter spoofing (a collector cannot fetch another collector's counts).
- **Date Format**: Ensure robust handling of date strings, validating format correctness (e.g. `YYYY-MM-DD`).
- **File limits**: Keep files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** verifying the count query fetches the correct collector context and calls the query SPI.
- [ ] Write **Integration Tests** in the persistence layer verifying counts are scoped correctly by date and collector.
- [ ] Write **Controller Tests** verifying that calling `GET /submissions/my-count` with valid authorization yields the count, while fetching without tokens or as Admin is blocked.
- [ ] Implement query logic, repository logic, and controller endpoints to satisfy requirements.

## Blocked by

- Blocked by [003-persistence-adapter-joined-table-mappings.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/003-persistence-adapter-joined-table-mappings.md)
