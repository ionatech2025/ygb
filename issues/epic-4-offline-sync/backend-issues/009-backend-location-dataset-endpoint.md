## Objective

Implement the backend endpoint that serves the Uganda administrative location dataset (District → Sub-county → Parish → Village) to the PWA frontend. This endpoint is the server-side counterpart to US-SYNC-05, which requires the frontend to bundle the location data on install and refresh it in the background whenever connectivity is available.

The endpoint must:
1. Return the full hierarchical Uganda admin dataset as a single JSON payload.
2. Support HTTP `ETag` / `If-None-Match` caching so the PWA can check for updates without re-downloading the full payload when there are no changes.
3. Be publicly accessible (no authentication required), since location data is not sensitive and must load even before a collector logs in.

## Architectural Context

- **Core Domain**:
  - Introduce `AdminLocation` value object (or read-only record) in `domain/valueobjects` representing a location node with `id`, `name`, `parentId`, and `level` (DISTRICT, SUBCOUNTY, PARISH, VILLAGE).

- **Application Ports**:
  - Input Port (`api`): `GetAdminLocationDatasetUseCase` — returns the full dataset.
  - Output Port (`spi`): `AdminLocationRepositoryPort` — `List<AdminLocation> findAll()`.

- **Application Services**:
  - `GetAdminLocationDatasetService` — pure Java, no Spring annotations. Delegates to `AdminLocationRepositoryPort`. Wired programmatically in `configuration/UseCaseConfig`.

- **Adapters (Persistence)**:
  - `AdminLocationJpaEntity` with fields `id`, `name`, `parent_id`, `level`.
  - Flyway migration `V5__Create_Admin_Locations_Table.sql` with table definition and seed data for Uganda administrative units.
  - `AdminLocationRepositoryAdapter` implementing `AdminLocationRepositoryPort`.

- **Adapters (REST)**:
  - `AdminLocationController` at `GET /api/v1/locations/dataset`.
  - Returns `200 OK` with full JSON dataset or `304 Not Modified` if ETag matches.
  - Permitted to `ALL` (no security restriction).
  - Response DTO: `AdminLocationDatasetResponseDto` wrapping `List<AdminLocationDto>`.
  - MapStruct mapper: `AdminLocationRestMapper`.

## Technical Constraints & Clean Code

- **Public Access**: Configure Spring Security to `permitAll()` on `GET /api/v1/locations/dataset`.
- **ETag Support**: Use Spring's `ShallowEtagHeaderFilter` or manually compute and return an ETag header based on a version hash or dataset checksum.
- **File limits**: Keep all files under 200 lines. If the dataset seed SQL is large, split it across multiple migration files.
- **No Business Logic in Controller**: All dataset retrieval logic lives in the application service.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** verifying `AdminLocation` value object rejects null `id`, `name`, or `level`.
- [ ] Write **Application Tests** with a mocked `AdminLocationRepositoryPort` verifying `GetAdminLocationDatasetService` delegates correctly.
- [ ] Write **Persistence Integration Tests** (`@DataJpaTest` / Testcontainers) verifying the dataset loads from the migrated table and returns the correct count of districts.
- [ ] Write **Controller Tests** (`@WebMvcTest`) verifying:
  - `GET /api/v1/locations/dataset` returns `200 OK` with a JSON array.
  - Unauthenticated requests are **not** rejected (no 401/403).
  - A subsequent request with the correct `If-None-Match` ETag returns `304 Not Modified`.
- [ ] Implement Flyway migration with Uganda admin data.
- [ ] Implement all domain, application, and adapter classes.

## Blocked by

None — can start immediately. This is an independent feature.
