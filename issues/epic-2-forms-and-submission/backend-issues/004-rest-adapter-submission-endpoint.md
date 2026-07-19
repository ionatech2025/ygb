## Objective

Create the REST controller endpoint for submitting survey forms, validate JSON payloads, map request DTOs, and restrict endpoint access using Spring Security filters.

## Architectural Context

- **Adapters (REST)**:
  - Input Controller: `SubmissionController` exposing `POST /submissions`.
  - DTOs: `SubmissionRequestDto` and subclass DTOs corresponding to each form type.
  - Configuration: Spring Security config (`SecurityFilterChain`) mapping path authorization.
  - Mappers: MapStruct mappers for mapping REST DTOs to Application `SubmitSubmissionCommand` structures.

## Technical Constraints & Clean Code

- **Security Gate**: Secure the endpoint by restricting `POST /submissions` strictly to authenticated users with the `DATA_COLLECTOR` role. Ensure a token with the `ADMIN` role receives a `403 Forbidden` response.
- **Thin Controller**: The REST controller must do nothing except validate raw inputs (if using `@Valid`), extract collector context, invoke the use case, and map responses. Absolutely no business rules or DB logic inside the controller.
- **File limits**: Limit code files to under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Write REST **Controller Tests** using MockMvc (e.g. `@WebMvcTest(SubmissionController.class)`).
- [ ] Test that a POST request with `DATA_COLLECTOR` role successfully delegates to `SubmitSubmissionUseCase` and returns `201 Created`.
- [ ] Test that a POST request with `ADMIN` role returns `403 Forbidden`.
- [ ] Test that an unauthenticated POST request returns `401 Unauthorized`.
- [ ] Test DTO mapping verification (ensuring correct form types construct the appropriate child request command).
- [ ] Implement controller endpoint, DTO classes, MapStruct mappers, and Spring Security configurations.

## Blocked by

- Blocked by [003-persistence-adapter-joined-table-mappings.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/003-persistence-adapter-joined-table-mappings.md)
