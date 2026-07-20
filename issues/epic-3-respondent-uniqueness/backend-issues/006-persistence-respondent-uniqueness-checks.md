## Objective

Implement database query capabilities and concurrency safety in the persistence layer to verify if a respondent has already submitted a specific form type in the current financial year period with a status of `SYNCED`.

## Architectural Context

- **Core Domain**:
  - Introduce `FormType` enum in the domain model layer containing: `BYP`, `IYP`, `LGO`, `PC`.
  - Add abstract `FormType getFormType()` method to `Submission` base class, implemented by subclasses.

- **Adapters (Persistence)**:
  - Entity: `SubmissionJpaEntity` needs to expose the JPA discriminator column `form_type` in a read-only fashion:
    ```java
    @Column(name = "form_type", insertable = false, updatable = false)
    private String formType;
    ```
  - Repository: `SubmissionJpaRepository` needs to provide a query method:
    ```java
    boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
        String phone, String formType, String financialYearPeriod, String status
    );
    ```
  - Output Port (`spi`): Update `SubmissionRepositoryPort` to expose:
    ```java
    boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
        String phone, com.ionatech.nac.ygb.domain.model.FormType formType, String financialYearPeriod, com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status
    );
    ```
  - Adapter implementation: `SubmissionRepositoryAdapter` implementing the new SPI port method, mapping the domain `FormType` and `SubmissionStatus` enums to String names before querying the JPA repository.

- **Database Migration (Flyway)**:
  - Create a new migration script `V4__Add_Synced_Respondent_Unique_Index.sql` to add a partial unique index on `(respondent_phone, form_type, financial_year_period) WHERE status = 'SYNCED'`.

## Technical Constraints & Clean Code

- **Clean Architecture Boundaries**: Ensure no domain entities are exposed in raw JPA queries. Expose the check via clean SPI interfaces.
- **Discriminator Column**: Expose `form_type` as a read-only field in the JPA entity without changing existing child table mappings.
- **Concurrency Safety**: The partial unique index must enforce that at most one `SYNCED` record can exist per respondent, form type, and FY period.
- **File limits**: Keep files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Create Flyway migration file `V4__Add_Synced_Respondent_Unique_Index.sql` with the partial unique index.
- [ ] Write **Integration Tests** in `SubmissionRepositoryAdapterTest` using Testcontainers to verify:
  - The database unique constraint correctly throws a `DataIntegrityViolationException` when attempting to save a duplicate submission with `status = 'SYNCED'` for the same phone, form type, and financial year period.
  - The database allows multiple submissions with the same phone, form type, and period if their status is `FLAGGED`.
  - The query `existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus` returns `true` when a `SYNCED` submission matches the parameters.
  - The query returns `false` if the matching submission is `FLAGGED` or `PENDING` rather than `SYNCED`.
- [ ] Implement the `FormType` enum in `domain/model/` and update `Submission` models.
- [ ] Implement the read-only `formType` field in `SubmissionJpaEntity`.
- [ ] Implement the query method in `SubmissionJpaRepository`.
- [ ] Implement the SPI port method in `SubmissionRepositoryPort` and `SubmissionRepositoryAdapter`.

## Blocked by

None - can start immediately.
