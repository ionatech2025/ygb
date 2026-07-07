## Objective

Implement the authentication use case and REST API endpoint to allow a Data Collector (or Admin) to log in with a phone number and password, and receive a JWT token. This addresses US-AUTH-02.

## Architectural Context

- **Application**: Create `api` input port `AuthenticateUserUseCase`. Implement `AuthenticateUserService` which validates credentials using Spring Security and generates tokens.
- **Adapters**: Create `AuthController` (`in/rest`) exposing `POST /api/v1/auth/login`. Map the incoming DTO to a command, invoke the use case, and map the result to a response DTO.

## Technical Constraints & Clean Code

- **Controllers**: Keep thin (< 150 lines), absolutely no business logic. Delegate entirely to the use case.
- **Methods**: Target < 20 lines.
- **Mappers**: Use MapStruct to map DTOs to Application Commands.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** with mocked `spi` ports to verify successful and failed login attempts.
- [ ] Write **Adapter Tests** using `@WebMvcTest` to verify the REST endpoint behavior (valid JSON, error handling).
- [ ] Implement the minimal production code (Controller, Service, DTOs, Mappers) to pass tests.
- [ ] Refactor for clear naming and adherence to Clean Architecture.

## Blocked by

- Blocked by `issues/001-domain-persistence-users.md`
- Blocked by `issues/002-security-jwt-configuration.md`
