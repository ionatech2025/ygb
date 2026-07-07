## Objective

Implement the use cases and endpoints for an Administrator to create new Data Collector accounts. This satisfies US-AUTH-01. (Note: US-AUTH-03 for Admins creating Admins is deferred until clarified).

## Architectural Context

- **Application**: Create `api` input port `CreateDataCollectorUseCase`. Implement `CreateDataCollectorService` to handle the business logic (ensure phone number is unique, hash password before saving via `spi`).
- **Adapters**: Create `UserController` (`in/rest`) exposing `POST /api/v1/admin/users/data-collectors`. Secure this endpoint to require the `ADMIN` role.

## Technical Constraints & Clean Code

- **Controllers**: Absolutely no business logic. Validation should be handled via standard Jakarta Validation on the DTO and core logic inside the Application layer.
- **Mappers**: Use MapStruct for transitioning between the Request DTO and the Application Command.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** with mocked `spi` ports to verify the use case correctly handles valid data and rejects duplicate phone numbers.
- [ ] Write **Adapter Tests** using `@WebMvcTest` with security context (`@WithMockUser(roles = "ADMIN")`) to verify only Admins can access the endpoint and that it returns the expected HTTP status codes.
- [ ] Implement the minimal production code (Controller, Service, DTOs, Mappers).
- [ ] Refactor for clear intent and layer separation.

## Blocked by

- Blocked by `issues/001-domain-persistence-users.md`
- Blocked by `issues/002-security-jwt-configuration.md`
