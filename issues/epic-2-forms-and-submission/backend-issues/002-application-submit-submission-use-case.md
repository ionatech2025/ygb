## Objective

Implement the Application layer use case, input ports, and output ports for processing and executing a new survey submission.

## Architectural Context

- **Application Ports**:
  - Input Port (`api`): `SubmitSubmissionUseCase` interface defining the `submit` contract.
  - Output Port (`spi`): `SubmissionRepositoryPort` interface defining persistence operations (saving, retrieving).
- **Application Services**:
  - `SubmitSubmissionService` implementing `SubmitSubmissionUseCase`.
- **Mappers & DTOs**:
  - `SubmitSubmissionCommand` as the application-level data carrier for the use case input.

## Technical Constraints & Clean Code

- **Ports & Adapters**: The Application layer must only reference domain entities and input/output ports. It must not depend on database models, REST controllers, MapStruct mappers (which belong in adapter/config layers), or Spring context directly (inject dependencies via constructor).
- **File limits**: Limit files to under 200 lines.
- **Coordination**: The application service must coordinate:
  1. Constructing the domain submission entity from the command.
  2. Executing domain self-validation (`submission.validate()`).
  3. Deriving metadata attributes (like financial period).
  4. Saving the submission using the `SubmissionRepositoryPort`.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** using JUnit 5 and Mockito.
- [ ] Test the happy path where a valid `SubmitSubmissionCommand` constructs a valid `Submission`, calls `validate()`, and invokes `SubmissionRepositoryPort.save()`.
- [ ] Test validation failure propagation: when the domain object throws a validation exception, the application service does not call the repository and propagates the exception.
- [ ] Implement `SubmitSubmissionCommand`, `SubmitSubmissionUseCase`, and `SubmitSubmissionService`.
- [ ] Verify that application services contain no persistence/framework annotations (other than standard `@Transactional` if required, although architecture configurations can also handle transaction boundaries).

## Blocked by

- Blocked by [001-domain-models-sealed-hierarchy.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/001-domain-models-sealed-hierarchy.md)
