## Objective

Require a valid **download session** on all public anonymised export endpoints (PDM, Budget Priorities, LGO Budget Allocation CSV/Excel) and **record a download event** for each successful export.

## Architectural Context

- **Application:** session validation port/use case; decorate or guard existing export use cases.
- **Adapters (in/rest):** accept session token (header e.g. `X-Download-Session` or query — prefer header); return 401/403 with clear problem detail when missing/expired.
- **Adapters:** persist `DownloadEvent` (dataset, format, timestamp, profile/session link; optional filter fingerprint).

## Technical Constraints & Clean Code

- Do not weaken anonymisation of export payloads.
- One event per successful download response (not per form submit alone).
- Keep controllers thin; shared guard/filter preferred over copy-paste across three controllers.

## Acceptance Criteria & TDD Checklist

- [ ] Integration/controller: export without session → rejected; with valid session → 200 + file body.
- [ ] Integration: expired/unknown session rejected.
- [ ] Integration: successful CSV and XLSX each create a download event with correct dataset + format.
- [ ] Existing filter semantics of exports unchanged when session is valid.
- [ ] Regression: admin authenticated exports (if any separate path) unaffected.

## Blocked by

- [002-backend-download-profile-registration-and-session-api.md](002-backend-download-profile-registration-and-session-api.md)

## Related

- Epic 6/7/8 public download APIs · US-DL-01
