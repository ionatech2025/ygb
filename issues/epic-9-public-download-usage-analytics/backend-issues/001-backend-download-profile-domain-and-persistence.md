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

- [ ] Domain tests: reject invalid email format; require consent; require Other-specify when field of operation is OTHER.
- [ ] Domain/session: session has expiry; expired session is not usable.
- [ ] Persistence integration: profile + session + download event round-trip via repository adapter.
- [ ] Flyway migration creates tables with indexes suitable for admin filters (gender, age, created_at) and session token lookup.
- [ ] Visit-event table may be created here or in 004 — if deferred, document in migration plan; prefer creating schema now to avoid churn.

## Blocked by

None — can start immediately.

## Related

- Parent: [prd.md](../prd.md) · [README](../README.md)
