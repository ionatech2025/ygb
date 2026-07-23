## Objective

Deliver the **Budget Priorities submission REST API** (US-BP-01 / BP-01, BP-03): accept a public submission for a sectoral section with phone number in demographics, validate fields, enforce `(phone, section, FY period)` uniqueness at application and DB level, and return a confirmation response.

**No OTP / verification token** in Epic 7 — phone is submitted with the form; duplicate blocking happens at submit time (409). SMS verification is deferred to [future-features.md FF-01](../../future-features.md).

## Architectural Context

- **Core Domain**:
  - Extend `BudgetPrioritySubmission` factory — validate required demographic fields (name, phone, age group, gender, district at minimum per SRS §4.7.1).
  - Validate `priorityAreas` non-empty for the given section (structure defined in domain; placeholder options acceptable until product finalises copy — see [require-polishing.md](../../require-polishing.md)).
  - Emit `BudgetPrioritySubmitted` on success.

- **Application Ports**:
  - Input (`api`): `SubmitBudgetPriorityUseCase` — `(section, demographics, priorityAreas)`.
  - Output (`spi`): `BudgetPrioritySubmissionRepositoryPort` — `save`, `existsByPhoneSectionAndPeriod`.

- **Application Services**:
  - `SubmitBudgetPriorityService` — validate phone format; check duplicate; persist submission.

- **Adapters (REST)**:
  - `POST /api/v1/public/budget-priorities/{section}` where `section` ∈ `{health, agriculture, education, climate}`.
  - Request: `{ demographics: { fullName, phoneNumber, ageGroup, gender, districtId, ... }, priorityAreas }`.
  - Response: `{ bpId, status: "SUBMITTED", section, financialYearPeriod }`.
  - Errors: `409` duplicate (TC-BP-01-02), `400` validation failures (RFC 7807).
  - Spring Security: `permitAll()` on `/api/v1/public/budget-priorities/**`.

- **Adapters (Persistence)**:
  - Catch unique-index violation → `DuplicateBudgetPrioritySubmissionException` → `409` (safety net behind application check).

## Technical Constraints & Clean Code

- **Current FY period:** Resolved server-side via `FinancialYearPeriodCalculator` — client must not override period.
- **Phone validation:** Uganda local format; normalize before duplicate check and persist.
- **MapStruct:** DTO ↔ domain only in adapter layer.
- **Controller:** < 150 lines; no business logic.

## Acceptance Criteria & TDD Checklist

- [x] Write **Domain Tests** for submission validation (missing demographics, empty priority areas, invalid phone).
- [x] Write **Application Tests** with mocked SPI:
  - Happy path → saved, event emitted.
  - Duplicate phone+section+period → `DuplicateBudgetPrioritySubmissionException` (TC-BP-01-02).
  - Same phone, different section → success (TC-BP-01-03).
- [x] Write **Controller Tests**:
  - Valid payload → `201 Created` with `bpId`.
  - Duplicate → `409` with clear problem detail.
  - Invalid phone → `400`.
- [x] Write **Integration Test** (Testcontainers): submit → second submit with same phone+section blocked.
- [x] Implement use case, controller, mappers, exception handling, security permit-all.

## Blocked by

- [001-backend-budget-priority-domain-and-persistence.md](001-backend-budget-priority-domain-and-persistence.md)
