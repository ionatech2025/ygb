## Objective

Accept anonymous **visit beacons** from public routes so admins can compare site traffic with download activity.

## Architectural Context

- **Domain/Application:** record page-view or public-session visit events (path/route group, timestamp, anonymous session id).
- **Adapters:** `POST /api/v1/public/analytics/visit` (or equivalent); no auth; no PII body fields.
- **Persistence:** visit event store (from 001 schema or migration here).

## Technical Constraints & Clean Code

- First-party only; no third-party scripts.
- Deduplicate or bucket by anonymous session id within a time window if designed (document rule in tests).
- Ignore or no-op beacons from admin/collector authenticated app shells if those routes are separate.

## Acceptance Criteria & TDD Checklist

- [x] Application/adapter test: valid beacon persists a visit event.
- [x] Reject payloads that attempt to send email/name (ignore unknown fields or 400 — pick one and test).
- [x] WebMvc: no auth required; returns 202/204 quickly.

## Blocked by

- [001-backend-download-profile-domain-and-persistence.md](001-backend-download-profile-domain-and-persistence.md) (schema)

## Related

- US-DL-03 · [prd.md](../prd.md)
