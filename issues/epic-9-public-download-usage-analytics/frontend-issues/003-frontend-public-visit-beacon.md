## Objective

Emit anonymous **visit beacons** from public routes (dashboard, resources, budget priorities, LGO public views) with a short privacy notice where appropriate.

## Architectural Context

- **Frontend:** lightweight beacon on route enter (dedupe per anonymous session id in sessionStorage).
- **Secondary adapter:** POST visit API from 004.

## Technical Constraints & Clean Code

- Do not beacon authenticated collector/admin app areas.
- Fail open: beacon errors must not break page UX.
- No PII in beacon payload.

## Acceptance Criteria & TDD Checklist

- [x] Public dashboard mount sends beacon (mocked adapter assertion).
- [x] Repeat navigations within same anonymous session follow dedupe rule under test.
- [x] Collector dashboard does not send public visit beacon.

## Blocked by

- Backend [004](../backend-issues/004-backend-public-visit-beacon-api.md)

## Related

- US-DL-03
