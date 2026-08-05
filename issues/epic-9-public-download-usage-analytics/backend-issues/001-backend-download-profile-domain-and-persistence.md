## Objective

Introduce domain models and persistence for **download profiles**, **download sessions**, **download events**, and (schema-ready) **visit events** that power gated public exports and usage analytics.

## Architectural Context

- **Core Domain:** `DownloadProfile`, `DownloadSession`, `DownloadEvent`, value objects (country code, field of operation, consent). Reuse existing `Gender` / `AgeGroup`.
- **Application:** SPI repository ports only in this issue (use cases in 002+).
- **Adapters:** JPA entities, Flyway migration, MapStruct mappers.

## Technical Constraints & Clean Code

- File limits and hexagonal boundaries per project standards.
- MapStruct for entity ↔ domain; no business logic in adapters.
- PII (email, name) stored only for admin analytics — never projected to public APIs.

## Acceptance Criteria & TDD Checklist

- [x] Domain tests: reject invalid email format; require consent; require Other-specify when field of operation is OTHER.
- [x] Domain/session: session has expiry; expired session is not usable.
- [x] Persistence integration: profile + session + download event round-trip via repository adapter.
- [x] Flyway migration creates tables with indexes suitable for admin filters (gender, age, created_at) and session token lookup.
- [x] Visit-event table created in V26 (schema ready for issue 004).

## Blocked by

None — can start immediately.

## Related

- Parent: [prd.md](../prd.md) · [README](../README.md)

## Delivered

- Domain: `EmailAddress`, `IsoCountryCode`, `Gender`, `FieldOfOperation`, `PublicDownloadDataset`, `DownloadProfile`, `DownloadSession`, `DownloadEvent`, `PublicVisitEvent`
- SPI ports + JPA adapters + MapStruct mappers
- Flyway `V26__Create_Download_Profile_Usage_Tables.sql`
