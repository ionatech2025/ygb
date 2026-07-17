## Objective

Implement the application-level logic to validate respondent uniqueness at sync/submission time and map the submission status to `SYNCED` or `FLAGGED` accordingly.

## Architectural Context

- **Application Services**:

  - `SubmitSubmissionService`: Before saving the submission, check if a duplicate exists using the new `existsByRespondentPhoneAndFormTypeAndFinancialYearPeriod` SPI method.

  - If a duplicate exists, update the submission status to `SubmissionStatus.FLAGGED` before persistence.

  - If no duplicate exists, update the submission status to `SubmissionStatus.SYNCED` before persistence.

## Technical Constraints & Clean Code

- **Ports and Adapters**: The Application service must only interact with the domain models and the SPI ports. It must not reference any JPA models or controller classes.

- **Status Transition**: Update status using the domain method `submission.updateStatus(...)`.

- **File limits**: Keep files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** in `SubmitSubmissionServiceTest` verifying:

  - Happy path: when no duplicate exists, the service queries the SPI, gets `false`, sets the submission status to `SYNCED`, and saves it.

  - Duplicate path: when a duplicate is found by the SPI check, the service queries the SPI, gets `true`, sets the submission status to `FLAGGED`, and saves it.

  - Validation failure: if validation fails, the service does not perform the duplicate check or save the submission.

- [ ] Implement the service logic check in `SubmitSubmissionService`.

- [ ] Refactor to ensure all methods remain under 20 lines.

## Blocked by

- Blocked by [006-persistence-respondent-uniqueness-checks.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/006-persistence-respondent-uniqueness-checks.md)
