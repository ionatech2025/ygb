# Issue 004: Frontend BYP Form - Remove Q4 (`fundsReceiptWaitAfterApplied`) Field

## Objective

Remove **Question 4 (`fundsReceiptWaitAfterApplied`)** from the Beneficiary Young Person (BYP) frontend form UI, domain model, validation logic, serialization payload, and Vitest test suites.

## Architectural Context

- **Core Domain (`frontend/src/core/domain/byp-form.model.ts`)**:
  - Remove `fundsReceiptWaitAfterApplied` from `BypFormFields` interface and `EMPTY_BYP_FIELDS` object.
- **Validation & Serialization (`frontend/src/core/byp-validation.ts`)**:
  - Remove `fundsReceiptWaitAfterApplied` validation block from `validateBypForm`.
  - Remove `fundsReceiptWaitAfterApplied` property from `buildBypSubmissionPayload`.
- **Primary Adapters / Web Form (`frontend/src/adapters/primary/web/forms/byp/BypFundSection.tsx`)**:
  - Remove Q4 `<FormField>` containing `<textarea id="fundsReceiptWaitAfterApplied" ... />`.

## Technical Constraints & Clean Code

- **File Limits**: Keep files under 200 lines.
- **UI Consistency**: Form layout and section title ("Section A — Fund acquisition & disbursement") remain clean and responsive.
- **Methods/Handlers**: Keep form handlers small (< 20 lines), max nesting depth 2.

## Acceptance Criteria & TDD Checklist

- [ ] **Domain Model**: `BypFormFields` and `EMPTY_BYP_FIELDS` no longer include `fundsReceiptWaitAfterApplied`.
- [ ] **UI Component (`BypFundSection.tsx`)**:
  - Q4 textarea is completely removed from the form section.
  - Remaining fields (Q1 dropdown/specify, Q2 Yes/No, Q3 cash amount, and money usage textarea) render cleanly.
- [ ] **Validation & Payload (`byp-validation.ts`)**:
  - `validateBypForm` no longer checks or returns errors for `fundsReceiptWaitAfterApplied`.
  - `buildBypSubmissionPayload` no longer outputs `fundsReceiptWaitAfterApplied` in the payload object.
- [ ] **Automated Tests (`byp-validation.test.ts` & `BypForm.test.tsx`)**:
  - Update `validByp` test fixture to omit `fundsReceiptWaitAfterApplied`.
  - Remove Q4 assertions from form fill test helpers (`fillMinimalValidForm`).
  - All BYP unit and component tests pass cleanly.

## Blocked by

- Blocked by `issues/fixes/on_13082026/backend/003-backend-byp-removal-q4-funds-receipt-wait-field.md` for end-to-end API payload submission.
