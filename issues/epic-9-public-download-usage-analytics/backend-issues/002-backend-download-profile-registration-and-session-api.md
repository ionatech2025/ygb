## Objective

Expose a public API to **register a download profile** (with consent) and receive a short-lived **download session token** used to unlock CSV/Excel exports.

## Architectural Context

- **Application:** `RegisterDownloadProfileUseCase` — validates profile, persists, issues opaque session token (~1 hour TTL).
- **Adapters (in/rest):** `POST /api/v1/public/download-profile` (or equivalent) returning session token + expiry; no auth.
- **Adapters (out):** persistence from 001.

## Technical Constraints & Clean Code

- Thin controller; MapStruct request DTO → command.
- Rate-limit consideration noted (basic abuse protection optional; not blocking if infra not ready).
- Do not create login accounts or passwords.

## Acceptance Criteria & TDD Checklist

- [ ] Application test: valid registration returns session with future expiry and persists profile.
- [ ] Application test: missing consent / invalid email / missing Other-specify rejected.
- [ ] WebMvc test: 200/201 with token; 400 on validation errors; no Authorization header required.
- [ ] Token is opaque (not email/JWT with PII claims required for MVP — opaque server-side session preferred).

## Blocked by

- [001-backend-download-profile-domain-and-persistence.md](001-backend-download-profile-domain-and-persistence.md)

## Related

- US-DL-01 · [prd.md](../prd.md)
