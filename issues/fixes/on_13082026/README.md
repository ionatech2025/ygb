# Fixes — August 13, 2026

Corrections for Parish Chief (PC) Questionnaire UI and domain models regarding missing form controls and conditional display for Questions Q15, Q16, Q24, and Q25.

## Problems observed

| # | Question(s) | Symptom / Issue | Affected Components / Files |
|---|-------------|-----------------|-----------------------------|
| 1 | **Q15 & Q16** | Q15 ("Did anyone monitor the programme execution in your parish?") options (Yes/No) are not displayed; Q15 is rendered as a static `<p>` text. Q16 options ("who monitored the programme?") are ever-present and required even if no monitoring occurred. | `PcMonitoringSection.tsx`, `pc-form.model.ts`, `pc-validation.ts`, `PcSubmission.java`, `PcSubmissionJpaEntity.java` |
| 2 | **Q24 & Q25** | Q24 ("number of beneficiaries with stable income") and Q25 ("number of beneficiaries trained in productivity/business viability") options/fields are not displayed; they are rendered as static `<p>` paragraphs without `<input>` fields. | `PcSelfRelianceSection.tsx`, `pc-form.model.ts`, `pc-validation.ts`, `PcSubmission.java`, `PcSubmissionJpaEntity.java` |

## Issue breakdown

| # | Issue | Layer | Summary |
|---|-------|-------|---------|
| 001 | [Frontend PC Form Q15/Q16 & Q24/Q25 Fix](./frontend/001-frontend-pc-form-q15-q16-q24-q25-fix.md) | Frontend | Add Q15 `YesNoRadioGroup` with conditional Q16 multi-checkbox display; add Q24 and Q25 numeric `<input>` fields with validation and payload mapping |
| 002 | [Backend PC Submission Q15, Q24, Q25 Fields](./backend/002-backend-pc-submission-q15-q24-q25-fields.md) | Backend | Add `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount` to domain model, DTOs, JPA entity, and Flyway migration V27 |

## Recommended order

1. **002 (Backend)** — Add `programmeMonitored`, `selfRelianceStableIncomeCount`, and `selfRelianceTrainedCount` to `PcSubmission` domain, JPA entity, DTOs, and DB migration `V27`.
2. **001 (Frontend)** — Add UI controls (Q15 radio group, conditional Q16 display, Q24/Q25 numeric input fields) and update validation + unit tests.
