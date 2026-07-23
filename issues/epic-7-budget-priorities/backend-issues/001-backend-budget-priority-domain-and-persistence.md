## Objective

Establish the **Budget Priorities core domain** and **persistence layer** (US-BP-01 foundation): the `BudgetPrioritySubmission` aggregate, sector and FY-period value objects, the `(phoneNumber, section, financialYearPeriod)` uniqueness invariant (BP-02/BP-03), Flyway migration for `budget_priority_submissions`, and outbound repository port with JPA adapter.

This issue does **not** deliver REST endpoints (issues `002`–`004`).

## Architectural Context

- **Core Domain** (`domain/budgetpriority/` or equivalent package):
  - `BudgetPrioritySection` — enum `{ HEALTH, AGRICULTURE, EDUCATION, CLIMATE }` (maps to API path segments `health`, `agriculture`, `education`, `climate`).
  - `BudgetPrioritySubmission` — aggregate root: `bpId`, phone number, section, `priorityAreas` (JSONB-friendly structure), `demographicData` (JSONB), `financialYearPeriod`, `submittedAt`.
  - Phone value object wrapping Uganda local format; reuse validation rules from existing `PhoneNumber` where possible.
  - Invariant: `(phoneNumber, section, financialYearPeriod)` must be unique — one submission per sector per person per FY period.
  - Domain event: `BudgetPrioritySubmitted(bpId, section, period)`.
  - Domain exception: `DuplicateBudgetPrioritySubmissionException` when uniqueness violated.

- **Application Ports**:
  - Output (`spi`): `BudgetPrioritySubmissionRepositoryPort` — `save`, `existsByPhoneSectionAndPeriod(phone, section, period)`.

- **Adapters (Persistence)**:
  - Flyway migration `V*__create_budget_priority_submissions.sql` matching [`backend_docs/domain_arch_apis`](../../../backend/backend_docs/domain_arch_apis):
    - Table `budget_priority_submissions` with JSONB columns `priority_areas`, `demographic_data`.
    - Unique index `uniq_bp_phone_section_period ON (phone_number, section, financial_year_period)`.
  - JPA entity + `BudgetPrioritySubmissionRepositoryAdapter` implementing SPI.
  - MapStruct mapper: entity ↔ domain (no business logic in adapter).

## Technical Constraints & Clean Code

- **Domain purity:** Zero Spring/JPA imports in domain package.
- **FY period:** Reuse existing `FinancialYearPeriod` value object and calculator from submission domain — do not duplicate period logic.
- **PII storage:** Phone number and respondent name live server-side only; never exposed on public read paths (enforced in issues `004`–`005`).
- **JSONB shape:** Document expected keys for `priority_areas` and `demographic_data` in domain tests; allow extensibility for future question additions (NFR 5.5).

## Acceptance Criteria & TDD Checklist

- [x] Write **Domain Tests** for `BudgetPrioritySubmission` creation and section enum parsing.
- [x] Write **Domain Tests** verifying uniqueness invariant — same phone + same section + same FY period → rejected.
- [x] Write **Domain Tests** verifying different section with same phone + same FY period → allowed (TC-BP-01-03 at domain level).
- [x] Write **Application Tests** with mocked SPI for repository `existsByPhoneSectionAndPeriod` behaviour.
- [x] Write **Persistence Tests** (`@DataJpaTest` or Testcontainers):
  - Insert succeeds for valid row.
  - Second insert with same `(phone, section, period)` violates unique index → translated to `DuplicateBudgetPrioritySubmissionException`.
- [x] Flyway migration applies cleanly on empty and existing databases.
- [x] Implement aggregate, port, entity, adapter, and migration.

## Blocked by

None — can start immediately. Reuses `FinancialYearPeriod` from Epic 2/3 submission domain.
