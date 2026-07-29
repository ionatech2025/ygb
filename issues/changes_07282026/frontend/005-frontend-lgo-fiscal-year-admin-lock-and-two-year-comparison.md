## Objective

Revise the **Local Government Official (LGO)** form for admin-controlled fiscal year and **two-year comparison** entry (Q1–Q3), plus clarified beneficiary and parish wording.

Sources: [lgo_questions.md](../../docs/suggested_changes/07282026/lgo_questions.md), [PDM_Tools_Change_Requests_07282026.md §4](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Target form behaviour

1. **Fiscal year** — read admin-selected current FY from API (not free picker per enumerator). Show label: *"Reporting for fiscal year: {admin FY}"*.
2. **Two-year blocks** — for Q1–Q3, render **(a) Admin-set FY** and **(b) Prior FY** sub-sections (not duplicate question numbers).
3. **Q1** — Expected/actual PDM funds received for each FY.
4. **Q2** — Beneficiary counts per FY:
  - Beneficiaries under 30
  - Beneficiary Young women under 30
  - Beneficiary **Young men under 30** (new field)
  - Other categories
5. **Q3** — Parishes per FY:
  - Total parishes **in the district**
  - Parishes that **received PDM funds**
6. **Q4–Q9** — governance questions (unchanged structure; unpack terse labels to full sentences).
7. **Q10** — Programme improvement suggestion (PDM programme, not survey).



## Question reference (from client doc)

See full wording in [lgo_questions.md](../../docs/suggested_changes/07282026/lgo_questions.md).

## Admin UI (same issue or sub-task)

- Admin settings screen/control to set current fiscal year (calls backend 002 API).
- Place in existing admin dashboard settings or Manage Users adjacent panel.



## Architectural Context

- **Frontend** — `LgoForm.tsx`, `LgoFiscalYearSection.tsx` → refactor to dual-FY layout; `lgo-validation.ts`, `lgo-form.model.ts`.
- Remove enumerator-facing FY dropdown; replace with admin FY display + prior FY auto-label.



## Acceptance Criteria & TDD Checklist

- [x] Component test: two FY blocks rendered with (a)/(b) labels.
- [x] Component test: young men count field present per FY block.
- [x] Component test: parish labels distinguish "in the district" vs "received PDM funds".
- [x] Component test: collector cannot change admin-selected current FY.
- [x] Admin component test: set fiscal year calls PUT API and shows success.
- [x] Unit test: payload contains two `fiscalYearRecords` with correct labels.



## Blocked by

- [backend/002-backend-admin-current-fiscal-year-setting.md](../backend/002-backend-admin-current-fiscal-year-setting.md)
- [backend/003-backend-lgo-two-year-comparison-and-gender-split.md](../backend/003-backend-lgo-two-year-comparison-and-gender-split.md)

