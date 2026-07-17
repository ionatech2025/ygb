## Objective

Implement the application-level logic to validate respondent uniqueness at sync/submission time, map the submission status to `SYNCED` or `FLAGGED`, and handle concurrency exceptions correctly.

## Architectural Context

- **Application Services**:
  - `SubmitSubmissionService`: Before saving the submission, check if a `SYNCED` duplicate exists in the database for this phone number, form type, and financial year period using the updated SPI:
    `existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(...)`.
  - If a `SYNCED` duplicate exists, set the incoming submission status to `SubmissionStatus.FLAGGED`.
  - If no duplicate exists, set the incoming submission status to `SubmissionStatus.SYNCED`.
  - **Concurrency Handling**: If `repositoryPort.save(submission)` throws a persistence duplicate error (due to a concurrent insert violating the unique constraint in index `idx_unique_synced_respondent`), catch the exception, set the submission status to `SubmissionStatus.FLAGGED`, and retry saving the submission.

## Technical Constraints & Clean Code

- **Ports and Adapters**: The Application service must only interact with the domain models and the SPI ports. It must not reference any JPA models or controller classes.
- **Status Transition**: Update status using the domain method `submission.updateStatus(...)`.
- **File limits**: Keep files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** in `SubmitSubmissionServiceTest` verifying:
  - Happy path: when no duplicate exists, the service queries the SPI, gets `false`, sets the submission status to `SYNCED`, saves it, and returns the saved submission.
  - Duplicate path: when a duplicate is found by the SPI check, the service queries the SPI, gets `true`, sets the submission status to `FLAGGED`, saves it, and returns it.
  - Concurrency exception handling: when the service gets `false` from the check, tries to save with `SYNCED`, but the repository throws an exception (due to a concurrent write), the service catches the exception, updates the status to `FLAGGED`, and successfully saves and returns the submission.
  - Validation failure: if domain validation fails, the service does not perform the duplicate check or save.
- [ ] Implement the uniqueness check, status mapping, and exception recovery logic in `SubmitSubmissionService`.
- [ ] Refactor to ensure all methods remain under 20 lines.

## Blocked by

- Blocked by [006-persistence-respondent-uniqueness-checks.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/006-persistence-respondent-uniqueness-checks.md)
