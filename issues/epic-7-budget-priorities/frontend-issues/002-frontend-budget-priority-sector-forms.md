## Objective

Build the **four sectoral Budget Priorities forms** (US-BP-01 / BP-01, BP-03): shared demographics capture (name, **phone**, age group, gender, location) and sector-specific **priority area** multi-select inputs, wired to `POST /api/v1/public/budget-priorities/{section}`.

**No OTP gate** in Epic 7 — phone is a required form field; duplicate blocking happens on submit (409). OTP flow deferred to [future-features.md FF-01](../../future-features.md).

## Architectural Context

- **Frontend Domain**:
  - `budget-priority-submission.model.ts` — payload types mirroring `BudgetPrioritySubmissionRequest` DTO (no `verificationToken`).
  - `budget-priority-form-config.ts` — per-section priority area options (placeholder lists until product finalises — see [require-polishing.md](../../require-polishing.md)).
  - Validation rules: required demographics including phone; at least one priority area selected.

- **Ports**:
  - `IBudgetPriorityApiPort` — `submit(section, payload)`.

- **Secondary Adapter**:
  - `HttpBudgetPriorityAdapter` — `POST /api/v1/public/budget-priorities/{section}`.

- **Components** (`src/adapters/primary/web/budget-priorities/`):
  - `BudgetPriorityDemographicsSection.tsx` — shared fields including editable phone (reuse `FormField`, location selector).
  - `BudgetPriorityAreasSection.tsx` — sector-specific multi-select / ranked priorities UI.
  - `BudgetPriorityForm.tsx` — composes sections; accepts `section` prop.
  - Sector entry via `/budget-priorities/:section` — form shown immediately (no verification step).

- **Reuse from Epic 2:**
  - `FormField`, `MultiCheckboxGroup`, gender/age enums from `form-validation.model.ts`.
  - `isValidUgandaPhoneLocal` from phone utils.

## Technical Constraints & Clean Code

- **TC-BP-01-03:** Same phone may submit different sections — backend enforces per-section uniqueness.
- **No offline queue:** Public BP forms submit online only (unlike collector PWA forms).
- **File limits:** Extract shared sections; keep each sector wrapper < 150 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Unit tests for validation — empty priority areas fails; invalid phone fails; valid payload passes.
- [ ] Unit tests for form config — four sections each have distinct priority area options.
- [ ] Component test: Health form renders demographics (including phone) + priority fields on load.
- [ ] Component test: submit calls adapter with correct section path and demographics.phoneNumber.
- [ ] Component test: all four section routes render correct titles/descriptions.
- [ ] Adapter test: POST body matches backend DTO field names (no verificationToken).
- [ ] Implement port, adapter, shared form components, and four section routes.

## Blocked by

- [001-frontend-budget-priorities-shell-and-sector-navigation.md](001-frontend-budget-priorities-shell-and-sector-navigation.md) — routes and section layout.
- Backend [002-backend-budget-priority-submission-api.md](../backend-issues/002-backend-budget-priority-submission-api.md) — submit API (can mock until ready).
