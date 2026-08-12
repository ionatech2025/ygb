# Issue 003: Backend BYP Submission - Remove Q4 (`fundsReceiptWaitAfterApplied`) Field

## Objective

Remove the redundant **Question 4 (`fundsReceiptWaitAfterApplied`)** field from the Beneficiary Young Person (BYP) backend domain model, application service, REST DTOs, JPA entities, MapStruct mappers, database schema, and test suites.

## Architectural Context

- **Core Domain (`backend/src/main/java/com/ionatech/nac/ygb/domain/model/BypSubmission.java`)**:
  - Remove field `private final NarrativeText fundsReceiptWaitAfterApplied;`
  - Remove constructor parameter, getter `fundsReceiptWaitAfterApplied()`, and validation check `if (fundsReceiptWaitAfterApplied == null)`.
- **Application Layer**:
  - `BypSubmitCommand.java`: Remove parameter `String fundsReceiptWaitAfterApplied`.
  - `SubmitSubmissionService.java`: Remove `fundsReceiptWaitAfterApplied` argument passed to `BypSubmission` constructor/factory.
- **Adapters Layer**:
  - `BypSubmissionRequestDto.java`: Remove `fundsReceiptWaitAfterApplied` field, constructor parameter, getter, and JSON property annotation.
  - `BypSubmissionJpaEntity.java`: Remove field `@Column(name = "funds_receipt_wait_after_applied") private String fundsReceiptWaitAfterApplied;` and getter/setter.
  - `SubmissionMapper.java`: Remove MapStruct mapping annotations targeting `fundsReceiptWaitAfterApplied`.
- **Database Migration (`backend/src/main/resources/db/migration/V28__Remove_Byp_Funds_Receipt_Wait_After_Applied_Column.sql`)**:
  - Drop column `funds_receipt_wait_after_applied` from `byp_submissions` table (or set `DROP COLUMN IF EXISTS funds_receipt_wait_after_applied`).

## Technical Constraints & Clean Code

- **File Limits**: Keep files under 200 lines.
- **Clean Architecture & Hexagonal Rules**: Preserved domain pure Java rules; infrastructure changes isolated to adapters.
- **Target Line Count/Complexity**: Methods under 20 lines, nesting depth max 2.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** (`BypSubmissionTest.java`) verifying `BypSubmission` instantiates cleanly without `fundsReceiptWaitAfterApplied`.
- [ ] Write **Application Tests** (`SubmitSubmissionServiceTest.java`, `BypSubmitCommandTest.java`) verifying BYP submission processing without `fundsReceiptWaitAfterApplied`.
- [ ] Write **Adapter & Integration Tests** (`BypSubmissionControllerTest.java`, `EnumeratorAttributionIntegrationTest.java`) verifying REST POST endpoint accepts BYP payload without `fundsReceiptWaitAfterApplied`.
- [ ] Implement production code changes across domain, application, REST DTO, JPA entity, and MapStruct mapper.
- [ ] Create Flyway migration script `V28__Remove_Byp_Funds_Receipt_Wait_After_Applied_Column.sql` and verify migration applies cleanly (`mvn clean compile`).

## Blocked by

None - can start immediately.
