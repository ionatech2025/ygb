## Objective

Deliver the **LGO Budget Allocation submission REST API** (US-LGOB-01 / LGO-01, LGO-02): authenticated Data Collectors record an LGO budget interview, persist linked `Submission` + `LgoBudgetAllocation`, and return a confirmation response. Public/unauthenticated access is denied (TC-LGOB-01-01).

## Architectural Context

- **Core Domain**:
  - Factory on `LgoBudgetAllocation` — validate `priorYearAllocations`, `rationale`, `recommendations` (LGO-02).
  - Emit `LgoBudgetAllocationRecorded` on success.

- **Application Ports**:
  - Input (`api`): `RecordLgoBudgetAllocationUseCase` — `(deviceSubmissionId, respondent, priorYearAllocations, rationale, recommendations, collectorUserId)`.
  - Output (`spi`): `LgoBudgetAllocationRepositoryPort`, `SubmissionRepositoryPort` (reuse Epic 2).

- **Application Services**:
  - `RecordLgoBudgetAllocationService` — verify caller is `DATA_COLLECTOR`; create/sync submission envelope; persist allocation row.

- **Adapters (REST)**:
  - `POST /api/v1/submissions/lgo-budget-allocation`
  - Request: `{ deviceSubmissionId, respondent, priorYearAllocations, rationale, recommendations }` per [`domain_arch_apis`](../../../backend/backend_docs/domain_arch_apis).
  - Response: `{ submissionId, lbaId, status }`.
  - Errors: `401`/`403` for unauthenticated or wrong role (TC-LGOB-01-01), `400` validation (RFC 7807).
  - Spring Security: `hasRole('DATA_COLLECTOR')` on POST; public routes must not expose this path.

- **Adapters (Persistence)**:
  - Transactional save: submission + allocation in one unit of work.

## Technical Constraints & Clean Code

- **Distinct form type:** Use a dedicated `FormType` or submission discriminator (e.g. `LGO_BUDGET_ALLOCATION`) — do not conflate with PDM `LGO` questionnaire submissions.
- **Offline sync:** Accept `deviceSubmissionId` for idempotent replay from collector PWA queue (Epic 4).
- **MapStruct:** DTO ↔ domain only in adapter layer.
- **Controller:** < 150 lines; no business logic.

## Acceptance Criteria & TDD Checklist

- [x] Write **Domain Tests** for allocation validation (TC-LGOB-01-02 field capture at domain level).
- [x] Write **Application Tests** with mocked SPI:
  - Happy path → submission + allocation saved, event emitted.
  - Non-collector role → rejected.
- [x] Write **Controller Tests**:
  - Authenticated collector + valid payload → `201 Created` with `lbaId`.
  - Unauthenticated → `401` (TC-LGOB-01-01).
  - Admin role without collector permission → `403`.
  - Invalid payload → `400`.
- [x] Write **Integration Test** (Testcontainers): full POST persists allocation JSONB and text fields correctly.
- [x] Implement use case, controller, mappers, security rules, exception handling.

## Blocked by

- [001-backend-lgo-budget-allocation-domain-and-persistence.md](001-backend-lgo-budget-allocation-domain-and-persistence.md)
