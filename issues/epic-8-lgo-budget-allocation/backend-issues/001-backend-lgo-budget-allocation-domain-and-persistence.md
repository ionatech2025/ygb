## Objective

Establish the **LGO Budget Allocation core domain** and **persistence layer** (US-LGOB-01 foundation): the `LgoBudgetAllocation` aggregate, value objects for prior-FY sector allocations / rationale / recommendations, Flyway migration for `lgo_budget_allocations`, and outbound repository port with JPA adapter.

This issue does **not** deliver REST endpoints (issues `002`–`004`).

## Architectural Context

- **Core Domain** (`domain/lgobudgetallocation/` or equivalent package):
  - `LgoBudgetAllocation` — aggregate root: `lbaId`, `submissionId` (FK to collector `Submission`), `previousFyAllocations` (JSONB-friendly breakdown), `rationale`, `recommendations`, `submittedAt`.
  - Value objects: `PriorYearAllocationBreakdown`, `Rationale`, `Recommendation` (wrap validation rules — non-empty rationale/recommendations at minimum per LGO-02).
  - Invariant: must reference a `Submission` collected by a `DATA_COLLECTOR`-role user; LGOs cannot self-submit (LGO-01).
  - Domain event: `LgoBudgetAllocationRecorded(lbaId)`.

- **Application Ports**:
  - Output (`spi`): `LgoBudgetAllocationRepositoryPort` — `save`, `findById`.

- **Adapters (Persistence)**:
  - Flyway migration `V*__create_lgo_budget_allocations.sql` matching [`backend_docs/domain_arch_apis`](../../../backend/backend_docs/domain_arch_apis):
    - Table `lgo_budget_allocations` with JSONB `previous_fy_allocations`, TEXT `rationale`, TEXT `recommendations`.
    - FK `submission_id` → `submissions(submission_id)`.
  - JPA entity + `LgoBudgetAllocationRepositoryAdapter` implementing SPI.
  - MapStruct mapper: entity ↔ domain (no business logic in adapter).

## Technical Constraints & Clean Code

- **Domain purity:** Zero Spring/JPA imports in domain package.
- **JSONB shape:** Document expected keys for `previous_fy_allocations` (sector → amount or percentage) in domain tests; allow extensibility for Phase 2 question additions (NFR 5.5).
- **Link to Submission:** Allocation row is always created in the same transaction as (or immediately after) the parent collector submission — exact orchestration in issue `002`.
- **PII:** LGO respondent demographics live on the linked `Submission` / `Respondent`; never exposed on public read paths (enforced in issues `003`–`004`).

## Acceptance Criteria & TDD Checklist

- [x] Write **Domain Tests** for `LgoBudgetAllocation` creation and required field validation.
- [x] Write **Domain Tests** verifying rationale and recommendations cannot be blank when submitting.
- [x] Write **Domain Tests** for `previousFyAllocations` structure validation (at least one sector entry).
- [x] Write **Application Tests** with mocked SPI for repository `save` behaviour.
- [x] Write **Persistence Tests** (`@DataJpaTest` or Testcontainers):
  - Insert succeeds with valid FK to `submissions`.
  - FK violation when `submission_id` missing → appropriate error.
- [x] Flyway migration applies cleanly on empty and existing databases.
- [x] Implement aggregate, port, entity, adapter, and migration.

## Blocked by

None — can start immediately. Reuses `Submission` aggregate from Epic 2 submission domain.
