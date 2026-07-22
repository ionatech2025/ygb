## Objective

Implement the application-level logic to validate respondent uniqueness at sync/submission time, map the submission status to `SYNCED` or `FLAGGED`, configure all application services programmatically without Spring annotations, and handle concurrency exceptions correctly with controller-level retry.

## Architectural Context

- **Core Domain**:
  - Create `DuplicateSyncedSubmissionException` in `domain/exceptions`.

- **Application Services**:
  - Remove `@Service` annotations from `SubmitSubmissionService`, `CreateDataCollectorService`, `AuthenticateUserService`, and `GetCollectorSubmissionCountService`.
  - Update `SubmitSubmissionService`: Before saving the submission, check if a `SYNCED` duplicate exists in the database for this phone number, form type, and financial year period using the SPI:
    `existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(phone, formType, period, SubmissionStatus.SYNCED)`.
  - If a `SYNCED` duplicate exists, set the incoming submission status to `SubmissionStatus.FLAGGED` using `submission.setStatus(...)`.
  - If no duplicate exists, set the incoming submission status to `SubmissionStatus.SYNCED`.

- **Configuration Layer**:
  - Create `UseCaseConfig` configuration class in the new `configuration` package.
  - Wire all use case beans programmatically. Declare `@Transactional` on the factory methods for write use cases (like `submit` and `createDataCollector`).

- **Adapters**:
  - Update `SubmissionRepositoryAdapter`: Catch Spring's `DataIntegrityViolationException` (due to unique index `idx_unique_synced_respondent` violation) and translate it to `DuplicateSyncedSubmissionException`.
  - Update `SubmissionController`: Catch `DuplicateSyncedSubmissionException` at the endpoint post method, and retry the use case invocation once.

- **Coding Standards Rules**:
  - Update `.agent/rules/CODING_STANDARDS.md` to strictly forbid Spring/framework annotations in the application layer services.

## Technical Constraints & Clean Code

- **Ports and Adapters**: The Application services must remain completely framework-independent (no Spring annotations).
- **File limits**: Keep files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [x] Update `.agent/rules/CODING_STANDARDS.md` to enforce framework-free application layer rules.
- [x] Implement `DuplicateSyncedSubmissionException` in the domain layer.
- [x] Write **Application Tests** in `SubmitSubmissionServiceTest` verifying:
  - Happy path: when no duplicate exists, the service queries the SPI, gets `false`, sets the submission status to `SYNCED`, and saves it.
  - Duplicate path: when a duplicate is found by the SPI check, the service queries the SPI, gets `true`, sets the submission status to `FLAGGED`, and saves it.
- [x] Remove `@Service` from all services and implement `UseCaseConfig`.
- [x] Update `SubmissionRepositoryAdapter` to translate `DataIntegrityViolationException` into `DuplicateSyncedSubmissionException`.
- [x] Controller returns `409 Conflict` via `@ExceptionHandler` (supersedes original retry-in-controller design; see issue 008).
- [x] Verify that all Maven tests pass.

## Blocked by

- Blocked by [006-persistence-respondent-uniqueness-checks.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/006-persistence-respondent-uniqueness-checks.md)
