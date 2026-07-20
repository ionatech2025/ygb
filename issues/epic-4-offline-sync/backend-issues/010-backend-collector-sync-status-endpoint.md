## Objective

Implement a backend endpoint that exposes the authenticated Data Collector's **server-side sync history** — specifically the total count of successfully received `SYNCED` submissions and the timestamp of the most recent server receipt. This supports US-SYNC-03 by letting the PWA refresh `lastSyncedAt` (and optionally reconcile `syncedCount`) from the server after connectivity is restored.

> **Design note — pending count is client-side only:** Device queue depth (`Pending: N`) lives in IndexedDB and `useSyncStore` (frontend issue 014). The submit flow persists submissions as `SYNCED` or `FLAGGED` immediately on server receipt, so a server-side `pendingCount` would always be `0` and is intentionally omitted from this endpoint.

The endpoint must return:
- `syncedCount`: total submissions in `SYNCED` status for this collector.
- `lastSyncedAt`: the server `synced_at` timestamp of the most recently received `SYNCED` submission by this collector (nullable if none). Set to `LocalDateTime.now()` in the persistence adapter when a submission is first saved as `SYNCED`.

> Note: The existing `GET /api/v1/submissions/my-count` only returns a daily `SYNCED` count. This new endpoint complements it with a full sync-status picture.

## Architectural Context

- **Application Ports**:
  - Input Port (`api`): `GetCollectorSyncStatusQuery` interface returning a `CollectorSyncStatus` record/value object with fields `syncedCount`, `lastSyncedAt`.
  - Output Port (`spi`): Extend `SubmissionRepositoryPort` with:
    - `long countByCollectorIdAndStatus(UUID collectorId, SubmissionStatus status)`
    - `Optional<LocalDateTime> findLatestSyncedAtByCollectorIdAndStatus(UUID collectorId, SubmissionStatus status)`

- **Application Services**:
  - `GetCollectorSyncStatusService` implementing `GetCollectorSyncStatusQuery`. Wire via `UseCaseConfig` (no Spring annotations on the service).

- **Adapters (Persistence)**:
  - Flyway migration `V6__Add_Synced_At_To_Submissions.sql` adds nullable `synced_at` column; backfill existing `SYNCED` rows from `form_completed_at`.
  - `SubmissionRepositoryAdapter.save()` stamps `synced_at = now()` when status is `SYNCED`.
  - Extend `SubmissionJpaRepository` with `findFirstByCollectorIdAndStatusOrderBySyncedAtDesc`.
  - Implement the new SPI methods in `SubmissionRepositoryAdapter`.

- **Adapters (REST)**:
  - Add `GET /api/v1/submissions/my-sync-status` to `SubmissionController`.
  - Restricted to `DATA_COLLECTOR` role.
  - Response DTO: `CollectorSyncStatusResponseDto`.

## Technical Constraints & Clean Code

- **Security Scoping**: The collector ID must always be resolved from the authenticated `Principal` — never accepted as a request parameter, to prevent IDOR.
- **Unauthenticated access**: Return `403 Forbidden` (Spring Security default for protected routes without credentials). Do **not** add a custom `AuthenticationEntryPoint` for `401` — collectors authenticate via JWT before calling this endpoint; `403` is sufficient and matches `GET /my-count`.
- **File limits**: `SubmissionController` must remain under 150 lines after adding this endpoint. If it grows beyond that, extract the sync-status endpoint into a new `SubmissionQueryController`.
- **No Business Logic in Controller**: All counting logic lives in the application service.

## Acceptance Criteria & TDD Checklist

- [x] Write **Application Tests** verifying `GetCollectorSyncStatusService` calls both SPI methods and assembles `CollectorSyncStatus` correctly.
- [x] Write **Persistence Integration Tests** (Testcontainers) verifying:
  - `countByCollectorIdAndStatus` returns correct counts for `SYNCED` state.
  - `findLatestSyncedAtByCollectorIdAndStatus` returns the most recent `synced_at` when submissions exist and `Optional.empty()` when none exist.
- [x] Write **Controller Tests** (`@WebMvcTest`) verifying:
  - `DATA_COLLECTOR` authenticated call returns `200 OK` with correct JSON shape (`syncedCount`, `lastSyncedAt`).
  - `ADMIN` role returns `403 Forbidden`.
  - Unauthenticated call returns `403 Forbidden`.
- [x] Implement all application, persistence, and REST layers.
- [x] Verify `SubmissionController` stays within 150 lines; if not, extract to `SubmissionQueryController`.

## Blocked by

- ~~Blocked by [epic-4-offline-sync/backend-issues/008-bugfix-submission-controller-duplicate-sync-handler.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/backend-issues/008-bugfix-submission-controller-duplicate-sync-handler.md)~~ — resolved.
