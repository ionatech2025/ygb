# Future Features — Deferred Backlog

Features documented in the SRS and user stories but **deferred** due to budget, phasing, or pending product decisions. Not part of current Epic 7 delivery unless explicitly pulled forward.

When a feature here is approved for implementation, extract it into the relevant epic (or a new epic) as numbered issue files — do not implement directly from this document without that step.

---

## FF-01 — Budget Priorities SMS / OTP phone verification

**Deferred from:** Epic 7 (Budget Priorities) — removed July 2026 due to SMS/OTP infrastructure cost.

**SRS / user story references:** BP-02, US-BP-01 (partial), TC-BP-01-01

**Original requirement:** Before filling a Budget Priorities section, the member of the public enters their phone number and verifies ownership via SMS OTP. The system pre-checks whether that phone has already submitted the specific section in the current financial-year period and blocks duplicates before the form is shown.

**Epic 7 interim behaviour (without OTP):** Phone number is collected on the sector form itself. Uniqueness `(phone, section, financialYearPeriod)` is enforced at **submit time** only (409 duplicate response). TC-BP-01-01 is **not** satisfied until this feature ships.

### Backend scope (when funded)

- **Core Domain:**
  - `PhoneVerificationService` — code generation, expiry, token signing contract.
  - `BudgetPriorityVerificationToken` — value object bound to `(phone, section, currentFyPeriod)`.
- **Application:**
  - `VerifyBudgetPriorityPhoneUseCase` — send OTP or validate code.
  - SPI: `SmsSenderPort`, `VerificationTokenStorePort`.
- **REST:**
  - `POST /api/v1/public/budget-priorities/verify-phone`
    - Request: `{ phoneNumber, section, code? }`
    - Response: `{ verified, verificationToken?, alreadySubmitted?, message? }`
- **Outbound:** Production SMS adapter (Africa's Talking, Twilio, or NAC-approved provider); dev stub with fixed OTP in `application-dev.yml`.
- **Submit API change:** `POST /api/v1/public/budget-priorities/{section}` requires `verificationToken` instead of raw phone in body (phone bound server-side to token).

### Frontend scope (when funded)

- `BudgetPriorityPhoneVerification.tsx` — phone entry → OTP confirm two-step UI.
- Verification token held in session memory (never localStorage).
- Form hidden until `verified === true` (TC-BP-01-01).
- `alreadySubmitted` block before form when phone already used for section this FY.
- Upgrade path from Epic 7 form-first flow: add verification gate to `BudgetPrioritySectionLayout`.

### Acceptance criteria (when implemented)

- [ ] TC-BP-01-01: Phone verification step precedes the sector form.
- [ ] TC-BP-01-02: Duplicate phone+section+FY blocked at verification (early) and at submit (safety net).
- [ ] Rate limiting on OTP requests (e.g. max 3/hour per phone).
- [ ] Phone numbers masked in application logs.
- [ ] Domain, application, controller, and integration tests per project TDD standards.

### Dependencies

- Epic 7 [001-backend-budget-priority-domain-and-persistence.md](epic-7-budget-priorities/backend-issues/001-backend-budget-priority-domain-and-persistence.md) — repository duplicate check.
- Epic 7 [002-backend-budget-priority-submission-api.md](epic-7-budget-priorities/backend-issues/002-backend-budget-priority-submission-api.md) — submit endpoint to extend with token validation.

### Related

- API sketch: [`backend/backend_docs/domain_arch_apis`](../backend/backend_docs/domain_arch_apis) — Budget Priorities `verify-phone` row (Phase 2 full spec).
- SRS: [`docs/ygb_srs_v1.1.md`](../docs/ygb_srs_v1.1.md) §4.7.2 BP-02.

---

## FF-02 — Programme Area filter on public dashboard

Deferred from Epic 6 — no persisted submission field yet. See [require-polishing.md](require-polishing.md).
