## Objective

Resolve UI bugs in the Parish Chief (PC) questionnaire form where:
1. **Q15 options (Yes/No) are not displayed** and **Q16 options are ever-present**: Q15 ("Did anyone monitor the programme execution in your parish?") is currently rendered as static paragraph text, while Q16 ("who monitored the programme?") multi-select options are always visible and required regardless of whether monitoring took place.
2. **Q24 and Q25 fields are not displayed**: Q24 ("number of young people with stable income from enterprises") and Q25 ("number of beneficiary young people trained to improve productivity/business viability") are rendered as static `<p>` text without any numerical `<input>` form fields.

## Architectural Context

- **Core Domain (`frontend/src/core/domain/pc-form.model.ts`)**:
  - Extend `PcFormFields` and `EMPTY_PC_FIELDS` to include:
    - `programmeMonitored: boolean | null` (Q15 response)
    - `selfRelianceStableIncomeCount: string` (Q24 numerical input)
    - `selfRelianceTrainedCount: string` (Q25 numerical input)
  - Add helper function `requiresMonitoredBy(programmeMonitored: boolean | null): boolean` returning `true` when `programmeMonitored === true`.
- **Validation & Serialization (`frontend/src/core/pc-validation.ts`)**:
  - Update `validatePcForm`:
    - Enforce requirement that `pc.programmeMonitored` must not be `null`.
    - Validate `pc.monitoredBy` as non-empty ONLY when `pc.programmeMonitored === true`.
    - Validate `pc.selfRelianceStableIncomeCount` and `pc.selfRelianceTrainedCount` using `validateCountField` (must be non-negative integers).
  - Update `buildPcSubmissionPayload`:
    - Include `programmeMonitored: pc.programmeMonitored as boolean`.
    - Include `monitoredBy: pc.programmeMonitored === true ? pc.monitoredBy : []`.
    - Include `monitoredByOthersSpecify: (pc.programmeMonitored === true && pc.monitoredBy.includes('OTHERS')) ? pc.monitoredByOthersSpecify.trim() : null`.
    - Include `selfRelianceStableIncomeCount: parseNonNegativeInteger(pc.selfRelianceStableIncomeCount) ?? 0`.
    - Include `selfRelianceTrainedCount: parseNonNegativeInteger(pc.selfRelianceTrainedCount) ?? 0`.
- **Primary Adapters / Web Forms**:
  - `PcMonitoringSection.tsx`:
    - Replace static `<p>` tag for Q15 with `<YesNoRadioGroup name="programmeMonitored" label="Q15. Did anyone monitor the programme execution in your parish?" value={value.programmeMonitored} onChange={...} required error={errors.programmeMonitored} />`.
    - Conditionally render `MultiCheckboxGroup` for Q16 ONLY when `value.programmeMonitored === true`.
    - When `programmeMonitored` is changed to `false` or `null`, reset `monitoredBy` to `[]` and `monitoredByOthersSpecify` to `''`.
  - `PcSelfRelianceSection.tsx`:
    - Replace static `<p>` tags for Q24 and Q25 with `<FormField>` components wrapping numeric `<input type="text" inputMode="numeric" ... />` for `selfRelianceStableIncomeCount` (Q24) and `selfRelianceTrainedCount` (Q25).

## Technical Constraints & Clean Code

- **File Limits**: Keep all modified files under 200 lines.
- **Methods/Functions**: Keep handlers small (< 20 lines), max nesting depth 2.
- **UI Consistency**: Use existing shared form controls (`YesNoRadioGroup`, `FormField`, `formControlClassName`) and dark theme styling tokens.

## Acceptance Criteria & TDD Checklist

- [ ] **Domain Model**: `PcFormFields` interface and `EMPTY_PC_FIELDS` include `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount`.
- [ ] **Section D UI (Q15 & Q16)**:
  - Q15 displays a `YesNoRadioGroup` with "Yes" and "No" options.
  - Q16 (`MultiCheckboxGroup`) is hidden by default when Q15 is unselected (`null`) or set to "No" (`false`).
  - Q16 (`MultiCheckboxGroup`) is visible when Q15 is set to "Yes" (`true`).
  - Selecting "No" for Q15 clears any previously checked Q16 options and clears `monitoredByOthersSpecify`.
- [ ] **Section E UI (Q24 & Q25)**:
  - Q24 displays an active numeric input field bound to `selfRelianceStableIncomeCount`.
  - Q25 displays an active numeric input field bound to `selfRelianceTrainedCount`.
- [ ] **Validation (`pc-validation.ts`)**:
  - Returns validation error if Q15 (`programmeMonitored`) is not selected (`null`).
  - Only returns `monitoredBy` validation error if Q15 is "Yes" (`true`) and no actors are selected.
  - Returns validation error if Q24 (`selfRelianceStableIncomeCount`) or Q25 (`selfRelianceTrainedCount`) is empty or not a valid non-negative integer.
- [ ] **Component Tests (`PcForm.test.tsx`)**:
  - Test verifying Q15 renders radio buttons and toggles Q16 visibility dynamically.
  - Test verifying Q24 and Q25 render numeric input fields and validate numeric inputs.
  - All existing PC form tests updated and passing.

## Blocked by

- Blocked by `issues/fixes/on_13082026/backend/002-backend-pc-submission-q15-q24-q25-fields.md` for end-to-end API payload submission.

## Related

- [README.md](../README.md)
- [Backend Issue 002](../backend/002-backend-pc-submission-q15-q24-q25-fields.md)
