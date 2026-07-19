## Objective

Implement a backend endpoint that exposes the authenticated Data Collector's **sync queue status** — specifically the count of submissions that are currently `PENDING` (queued on devices and not yet synced) and the timestamp of their last successful `SYNCED` submission. This supports US-SYNC-03, allowing the Admin to see per-collector pending-queue health from the server side.

The endpoint must return:
- `pendingCount`: the number of submissions submitted by this collector that remain in `PENDING` status.
- `syncedCount`: total submissions in `SYNCED` status for this collector.
- `lastSyncedAt`: the `submittedAt` timestamp of the most recently `SYNCED` submission by this collector (nullable if none).

> Note: The existing `GET /api/v1/submissions/my-count` only returns a daily `SYNCED` count. This new endpoint complements it with a full sync-status picture.

## Architectural Context

- **Application Ports**:
  - Input Port (`api`): `GetCollectorSyncStatusQuery` interface returning a `CollectorSyncStatus` record/value object with fields `pendingCount`, `syncedCount`, `lastSyncedAt`.
  - Output Port (`spi`): Extend `SubmissionRepositoryPort` with:
    - `long countByCollectorIdAndStatus(UUID collectorId, SubmissionStatus status)`
    - `Optional<Instant> findLatestSubmittedAtByCollectorIdAndStatus(UUID collectorId, SubmissionStatus status)`

- **Application Services**:
  - `GetCollectorSyncStatusService` implementing `GetCollectorSyncStatusQuery`. Wire via `UseCaseConfig` (no Spring annotations on the service).

- **Adapters (Persistence)**:
  - Extend `SubmissionJpaRepository` with the required query methods.
  - Implement the new SPI methods in `SubmissionRepositoryAdapter`.

- **Adapters (REST)**:
  - Add `GET /api/v1/submissions/my-sync-status` to `SubmissionController`.
  - Restricted to `DATA_COLLECTOR` role.
  - Response DTO: `CollectorSyncStatusResponseDto`.

## Technical Constraints & Clean Code

- **Security Scoping**: The collector ID must always be resolved from the authenticated `Principal` — never accepted as a request parameter, to prevent IDOR.
- **File limits**: `SubmissionController` must remain under 150 lines after adding this endpoint. If it grows beyond that, extract the sync-status endpoint into a new `SubmissionQueryController`.
- **No Business Logic in Controller**: All counting logic lives in the application service.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** verifying `GetCollectorSyncStatusService` calls both SPI methods and assembles `CollectorSyncStatus` correctly.
- [ ] Write **Persistence Integration Tests** (Testcontainers) verifying:
  - `countByCollectorIdAndStatus` returns correct counts for `PENDING` and `SYNCED` states.
  - `findLatestSubmittedAtByCollectorIdAndStatus` returns the most recent timestamp when submissions exist and `Optional.empty()` when none exist.
- [ ] Write **Controller Tests** (`@WebMvcTest`) verifying:
  - `DATA_COLLECTOR` authenticated call returns `200 OK` with correct JSON shape.
  - `ADMIN` role returns `403 Forbidden`.
  - Unauthenticated call returns `401 Unauthorized`.
- [ ] Implement all application, persistence, and REST layers.
- [ ] Verify `SubmissionController` stays within 150 lines; if not, extract to `SubmissionQueryController`.

## Blocked by

- Blocked by [epic-4-offline-sync/backend-issues/008-bugfix-submission-controller-duplicate-sync-handler.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/backend-issues/008-bugfix-submission-controller-duplicate-sync-handler.md)
