## Objective

Extend the Parish Chief (`PC`) submission backend domain model, application services, REST DTOs, JPA entities, and database schema to support fields for:
1. **Q15**: `programmeMonitored` (`Boolean`) — Did anyone monitor the programme execution in your parish?
2. **Q24**: `selfRelianceStableIncomeCount` (`Integer`) — Number of young people who benefited from PDM and had a stable income from established enterprises.
3. **Q25**: `selfRelianceTrainedCount` (`Integer`) — Number of beneficiary young people trained to improve productivity, efficiency, profitability, business viability, and supply chain.

## Architectural Context

Specify layers involved following Ports & Adapters Architecture:

- **Core Domain (`domain/model/PcSubmission.java`)**:
  - Add fields:
    - `private final Boolean programmeMonitored;`
    - `private final Integer selfRelianceStableIncomeCount;`
    - `private final Integer selfRelianceTrainedCount;`
  - Update constructor to accept these parameters.
  - Invariant Enforcement:
    - `programmeMonitored` must be non-null.
    - If `programmeMonitored` is `true`, `monitoredBy` list must not be empty.
    - If `programmeMonitored` is `false`, `monitoredBy` list can be empty.
    - `selfRelianceStableIncomeCount` and `selfRelianceTrainedCount` must be non-null and non-negative (`>= 0`).
  - Add getters: `getProgrammeMonitored()`, `getSelfRelianceStableIncomeCount()`, `getSelfRelianceTrainedCount()`.

- **Application Layer (`application/services/`, `application/ports/`)**:
  - `SubmitSubmissionService.java`: Update `PcSubmissionCommand` mapping to supply `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount` when constructing `PcSubmission`.
  - `GetSubmissionDetailService.java`: Ensure `PcSubmissionResponseDto` populates the 3 new fields.

- **Adapters In / REST (`adapters/in/rest/`)**:
  - `PcSubmissionRequestDto.java`: Add `@NotNull Boolean programmeMonitored`, `Integer selfRelianceStableIncomeCount`, `Integer selfRelianceTrainedCount`.
  - `AdminSubmissionPayloadMapper.java`: Map new attributes in admin submission JSON payloads.

- **Adapters Out / Persistence (`adapters/out/persistence/`)**:
  - `PcSubmissionJpaEntity.java`: Add `@Column(name = "programme_monitored", nullable = false) private Boolean programmeMonitored;`, `@Column(name = "self_reliance_stable_income_count", nullable = false) private Integer selfRelianceStableIncomeCount;`, and `@Column(name = "self_reliance_trained_count", nullable = false) private Integer selfRelianceTrainedCount;`.
  - `SubmissionMapper.java`: MapStruct interface mapping between `PcSubmission` domain model and `PcSubmissionJpaEntity`.
  - **Database Migration (`src/main/resources/db/migration/V27__Add_Pc_Q15_Q24_Q25_Fields.sql`)**:
    ```sql
    -- V27: Add missing Q15, Q24, Q25 fields to pc_submissions table
    ALTER TABLE pc_submissions ADD COLUMN programme_monitored BOOLEAN DEFAULT TRUE NOT NULL;
    ALTER TABLE pc_submissions ADD COLUMN self_reliance_stable_income_count INT DEFAULT 0 NOT NULL;
    ALTER TABLE pc_submissions ADD COLUMN self_reliance_trained_count INT DEFAULT 0 NOT NULL;
    ```

## Technical Constraints & Clean Code

- **Pure Java Domain**: `PcSubmission.java` must contain zero framework annotations (no Jackson, no Spring, no JPA).
- **Strict TDD**: Write pure Java domain unit tests before modifying `PcSubmission.java`.
- **File Limits**: Keep all modified classes under 500 lines; methods < 20 lines.
- **Explicit Wiring**: Update spring bean configurations cleanly without `@Autowired` field injection.

## Acceptance Criteria & TDD Checklist

- [ ] **Flyway Migration**: `V27__Add_Pc_Q15_Q24_Q25_Fields.sql` executes cleanly on app startup without syntax or schema errors.
- [ ] **Domain Tests (`PcSubmissionTest.java`)**:
  - Test verifying `PcSubmission` construction succeeds with valid `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount`.
  - Test verifying `IllegalArgumentException` thrown when `programmeMonitored` is null.
  - Test verifying `IllegalArgumentException` thrown when `programmeMonitored == true` but `monitoredBy` is empty.
  - Test verifying `programmeMonitored == false` allows empty `monitoredBy` list.
  - Test verifying `IllegalArgumentException` thrown when `selfRelianceStableIncomeCount < 0` or `selfRelianceTrainedCount < 0`.
- [ ] **Application Unit Tests (`SubmitSubmissionServiceTest.java`)**:
  - Test verifying application service processes PC submission command with new Q15, Q24, Q25 fields.
- [ ] **REST Controller Slice Tests (`SubmissionControllerTest.java`)**:
  - Test verifying POST `/api/v1/submissions` accepts and validates `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount`.
- [ ] **Persistence Integration Tests (`SubmissionRepositoryAdapterTest.java`)**:
  - Test verifying saving and reading `PcSubmission` to database persists and reads back `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount` correctly.

## Blocked by

None — can start immediately.

## Related

- [README.md](../README.md)
- [Frontend Issue 001](../frontend/001-frontend-pc-form-q15-q16-q24-q25-fix.md)
