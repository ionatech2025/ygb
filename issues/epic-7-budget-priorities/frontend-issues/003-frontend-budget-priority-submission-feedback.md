## Objective

Implement **submission outcome UX** for Budget Priorities (US-BP-01): success confirmation, duplicate-block messaging on submit (409), validation/server error handling, and post-submit navigation — covering TC-BP-01-02 and TC-BP-01-03.

## Architectural Context

- **Components**:
  - `BudgetPrioritySuccessPage.tsx` — thank-you message, submitted section + FY period summary, links to submit another sector or return to public dashboard.
  - `BudgetPriorityDuplicateBlock.tsx` — used when submit returns `409` (duplicate phone+section+FY).
  - `BudgetPriorityErrorAlert.tsx` — reusable alert for validation and network errors.

- **Core**:
  - Map API error codes (`409`, `400`) to user-facing copy in `budget-priority-errors.ts`.

- **Routes**:
  - `/budget-priorities/:section/success` — optional dedicated success route with state or query param guard.

## Technical Constraints & Clean Code

- **TC-BP-01-02:** Duplicate message names the section and explains one submission per FY period (shown after submit attempt, not pre-form — OTP pre-check deferred to [FF-01](../../future-features.md)).
- **TC-BP-01-03:** Success page offers links to other sector forms (e.g. “Submit Agriculture priorities”).
- **Accessibility:** Success and error regions use `role="status"` / `role="alert"`.
- **No dead ends:** Every terminal state has navigation back to index or dashboard.

## Acceptance Criteria & TDD Checklist

- [ ] Unit tests for error mapper — `409` → duplicate copy; `400` → validation copy.
- [ ] Component test: successful submit navigates to success view with section name.
- [ ] Component test: duplicate submit shows block UI without success message (TC-BP-01-02).
- [ ] Component test: success page lists other sectors as links (TC-BP-01-03).
- [ ] Implement success, duplicate, and error flows wired from form submit.

## Blocked by

- [002-frontend-budget-priority-sector-forms.md](002-frontend-budget-priority-sector-forms.md) — submit flow to hook outcomes.
