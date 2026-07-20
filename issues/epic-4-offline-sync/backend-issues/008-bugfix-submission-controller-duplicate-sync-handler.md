## Objective

Fix a critical bug in `SubmissionController` where the `catch (DuplicateSyncedSubmissionException ex)` block re-calls `submitUseCase.submit(command)` instead of returning a proper `409 Conflict` response. As currently implemented, if the adapter's `DataIntegrityViolationException` translation fires during the retry call, an unhandled exception will propagate and return a `500` to the client. The intent described in issue `007` was to retry **once** on a race-condition duplicate, not on an already-flagged record. The existing implementation conflates the two cases.

The fix requires:
1. Removing the no-op retry inside the `catch` block.
2. Re-reading the actual business requirement: the application service (`SubmitSubmissionService`) already handles both SYNCED and FLAGGED statuses before saving. A `DuplicateSyncedSubmissionException` from the adapter means a race condition caused **two SYNCED records to attempt a concurrent insert** at the DB level. In that scenario the correct response is to return `409 Conflict` with a descriptive body, not to retry silently.
3. Adding a dedicated `@ExceptionHandler` for `DuplicateSyncedSubmissionException` that returns `409 Conflict`.

## Architectural Context

- **Adapters (REST)**:
  - `SubmissionController` (`adapters/in/rest/SubmissionController.java`) — fix the broken catch/retry block and add a proper `@ExceptionHandler`.
  - No other layer needs changing; the exception is already declared in the domain and translated in the persistence adapter.

## Technical Constraints & Clean Code

- **Thin Controller**: The controller must not embed retry business logic. The application service already assigns SYNCED/FLAGGED; the controller's only job is to translate exceptions to HTTP status codes.
- **File limits**: Keep `SubmissionController` under 150 lines.
- **Single Responsibility**: One `@ExceptionHandler` per exception type — do not bundle unrelated exceptions in a single handler.

## Acceptance Criteria & TDD Checklist

- [ ] Write a **Controller Test** (`@WebMvcTest`) verifying that when `submitUseCase.submit` throws `DuplicateSyncedSubmissionException`, the endpoint returns `409 Conflict` with a JSON body containing a `message` field.
- [ ] Write a **Controller Test** verifying that a normal successful submission still returns `201 Created`.
- [ ] Remove the broken `try/catch` retry block from the `submit` method.
- [ ] Add `@ExceptionHandler(DuplicateSyncedSubmissionException.class)` returning `ResponseEntity` with `HttpStatus.CONFLICT` and a descriptive error body.
- [ ] Verify all existing `SubmissionControllerTest` tests still pass.

## Blocked by

None — can start immediately. The bug is self-contained in `SubmissionController`.
