## Objective

Wire **PDM**, **Budget Priorities**, and **LGO Budget Allocation** public export toolbars so CSV/Excel actions open the profile form when no valid session exists, then call exports with the session token and proceed with the file download.

## Architectural Context

- **Primary adapters:** `PublicDashboardExportToolbar`, Budget Priorities export UI, LGO export UI.
- **Secondary adapters:** pass download session header/token into export API clients.

## Technical Constraints & Clean Code

- Shared gate helper to avoid three divergent implementations.
- Preserve existing filter query params on export URLs.
- Clear error if backend rejects session mid-download.

## Acceptance Criteria & TDD Checklist

- [ ] Without session: clicking Download CSV/Excel opens profile form (no naked export call).
- [ ] With valid session: export proceeds for PDM, BP, and LGO without re-showing the form.
- [ ] After form success, original requested download continues (or user can click again — prefer auto-continue).
- [ ] Tests cover at least one toolbar end-to-end with mocked APIs; spot-check other two share the gate.

## Blocked by

- [001-frontend-download-profile-form-and-session.md](001-frontend-download-profile-form-and-session.md)
- Backend [003](../backend-issues/003-backend-gate-public-exports-and-record-download-events.md)

## Related

- US-DL-01 · supersedes one-click behaviour of US-PUB-04 / US-BP-02 / US-LGOB-02 downloads
