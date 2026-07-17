## Objective

Implement database query capabilities in the persistence layer to verify if a respondent has already submitted a specific form type in the current financial year period.

## Architectural Context

- **Adapters (Persistence)**:

  - Entity: `SubmissionJpaEntity` needs to expose the JPA discriminator column `form_type` in a read-only fashion (e.g., using `@Column(name = "form_type", insertable = false, updatable = false)`).

  - Repository: `SubmissionJpaRepository` needs to provide a query method `existsByRespondentPhoneAndFormTypeAndFinancialYearPeriod(String phone, String formType, String financialYearPeriod)`.

  - Output Port (`spi`): Update `SubmissionRepositoryPort` to expose:

    `boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriod(String phone, String formType, String financialYearPeriod)`.

  - Adapter implementation: `SubmissionRepositoryAdapter` implementing the new SPI port method by delegating to the JPA repository.

## Technical Constraints & Clean Code

- **Clean Architecture Boundaries**: Ensure no domain entities are exposed in raw JPA queries. Expose the check via clean SPI interfaces.

- **Discriminator Column**: Expose `form_type` as a read-only field in the JPA entity without changing existing child table mappings.

- **File limits**: Keep files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Integration Tests** in `SubmissionRepositoryAdapterTest` using Testcontainers to verify:

  - The query correctly returns `false` when no submission matches the phone number, form type, or financial year period.

  - The query correctly returns `true` when a submission matches the exact phone number, form type, and financial year period.

  - The query returns `false` if the phone number matches but the form type is different.

  - The query returns `false` if the phone number and form type match but the financial year period is different.

- [ ] Implement the read-only `formType` field in `SubmissionJpaEntity`.

- [ ] Implement the query method in `SubmissionJpaRepository`.

- [ ] Update `SubmissionRepositoryPort` and implement the method in `SubmissionRepositoryAdapter`.

## Blocked by

None - can start immediately.
