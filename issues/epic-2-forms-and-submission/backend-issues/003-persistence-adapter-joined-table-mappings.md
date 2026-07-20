## Objective

Implement the persistence adapter, mapping the rich sealed domain hierarchy of submissions to a JPA database structure using the joined table strategy, and implementing the repository port.

## Architectural Context

- **Adapters (Persistence)**:
  - Parent entity: `SubmissionJpaEntity` (contains shared fields: `id`, `collectorId`, `deviceSubmissionId`, `formCompletedAt`, `financialYearPeriod`, `status`, location reference IDs).
  - Child entities: `BypSubmissionJpaEntity`, `IypSubmissionJpaEntity`, `LgoSubmissionJpaEntity`, `PcSubmissionJpaEntity` mapped using inheritance `@Inheritance(strategy = InheritanceType.JOINED)`.
  - Spring Data JPA Repository interfaces (e.g., `SubmissionJpaRepository`).
  - Mappers: Dedicated MapStruct mappers mapping between JPA entities and Domain entities.
  - Concrete adapter: `SubmissionPersistenceAdapter` implementing `SubmissionRepositoryPort`.

## Technical Constraints & Clean Code

- **Idempotency Constraint**: Ensure the database table configures a `UNIQUE` constraint on `device_submission_id` to act as an idempotency key and prevent duplicate submissions.
- **Location Storage**: Store location details (`districtId`, `subcountyId`, `parishId`, `villageId`) as references/foreign keys.
- **Multi-select & Dynamic Lists**: Map checkboxes/arrays and LGO fiscal year lists to JSONB columns on child tables using custom JPA attribute converters or mapping utilities.
- **No Domain Leakage**: Database-specific annotations and JPA objects must not be exposed outside of the persistence adapter.

## Acceptance Criteria & TDD Checklist

- [ ] Write MapStruct unit tests verifying data mapping between domain objects and JPA entities.
- [ ] Write **Integration Tests** using `@DataJpaTest` or Testcontainers to verify:
  - Successful persistence and retrieval of `BypSubmissionJpaEntity`, `IypSubmissionJpaEntity`, `LgoSubmissionJpaEntity`, and `PcSubmissionJpaEntity`.
  - Multi-select JSONB columns and dynamic lists map and retrieve correctly.
  - Violating the `device_submission_id` unique constraint throws a `DataIntegrityViolationException` (idempotency safety).
- [ ] Implement entities, MapStruct mappers, JpaRepository, and the adapter class to pass all tests.

## Blocked by

- Blocked by [002-application-submit-submission-use-case.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/002-application-submit-submission-use-case.md)
