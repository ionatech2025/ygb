## Objective

Create the foundational data model for the application by implementing the `User` and `Role` models and their persistence mechanism. This establishes the base for all authentication and user management tasks.

## Architectural Context

- **Core Domain**: Create `User` entity, `Role` enum (ADMIN, DATA_COLLECTOR). No Spring or JPA annotations allowed in these classes.
- **Application**: Define the `spi` output port `UserRepositoryPort` for saving/loading users.
- **Adapters**: Implement `UserRepositoryAdapter` mapping to a Spring Data JPA repository (`UserJpaRepository`). Create the MapStruct mapper to transition between Domain `User` and Persistence `UserEntity`. Create the Flyway migration script to create the users table. Also seed some data into the created table for real testing.

## Technical Constraints & Clean Code

- **File Limits**: Keep files < 200 lines.
- **Mappers**: Use MapStruct for transitioning between `User` and `UserEntity`.
- **Domain**: Pure Java only. Do not leak JPA concepts into the domain layer.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** for `User` business invariants (e.g. required fields, valid roles).
- [ ] Write **Adapter Tests** using `@DataJpaTest` and Testcontainers to verify the persistence adapter and mappings.
- [ ] Implement the minimal production code to pass tests (Domain models, JPA Entity, Flyway V2 script, Repository Adapter).
- [ ] Refactor for intention-revealing naming and clean boundaries.

## Blocked by

None - can start immediately
