## Objective

Update the **LGO submission model** to match the revised questionnaire:

1. **Two fiscal year records** for Q1–Q3 data: admin-set current year **(a)** and prior year **(b)** (e.g. 2025/26 and 2024/25) — not a single selectable FY per submission.
2. **Gender breakdown**: add **young men** beneficiary count alongside young women (do not infer from total).
3. **Beneficiary wording**: fields refer to **beneficiaries under 30**, not general youth population.
4. **Parish count clarity**: distinguish total parishes in district vs parishes that received PDM funds (labels enforced in validation messages / API docs).

Reference: [lgo_questions.md](../../docs/suggested_changes/07282026/lgo_questions.md), [PDM_Tools_Change_Requests_07282026.md §4](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Revised LGO questions (Q1–Q3 structure)

**Q1.** How much did the district/city/sub-county/town council receive for PDM in the:
- **(a)** Admin-set FY — Expected / Actual received
- **(b)** Prior FY — Expected / Actual received

**Q2.** In total, how many **benefited from the PDM fund** in the:
- **(a)** Admin-set FY — (i) beneficiaries under 30, (ii) beneficiary young women under 30, (iii) beneficiary young men under 30, (iv) other categories
- **(b)** Prior FY — same sub-fields

**Q3.** How many parishes received the PDM fund in the district/city/sub-county/town council?
- **(a)** Admin-set FY — (i) total parishes **in the district**, (ii) parishes that **received PDM funds**
- **(b)** Prior FY — same sub-fields

**Q10.** What should be improved to make the **PDM programme** efficient and effective? (clarified wording)

## Architectural Context

- **Core Domain**
  - Extend `FiscalYearRecord` with `beneficiaryYoungMenCount` (and rename `youngPeopleCount` → `beneficiariesUnder30Count` and `youngWomenCount` to `beneficiaryYoungWomenCount` if breaking change acceptable; otherwise add alias field and deprecate old name with migration).
  - `LgoSubmission` requires **exactly two** fiscal year records: current admin FY + computed prior FY label.
  - Optional cross-validation: `beneficiaryYoungWomenCount + beneficiaryYoungMenCount <= beneficiariesUnder30Count` (warn or reject — confirm with client; default: soft validation warning in domain test).

- **Application**
  - Remove single-FY picker from submit command; accept two records with distinct labels.
  - Derive prior-year label from admin setting (e.g. `2025/26` → `2024/25`).

- **Adapters**
  - Update `LgoSubmissionRequestDto`, JPA JSON column, mappers, admin/public dashboard aggregations if they reference old field names.

## Acceptance Criteria & TDD Checklist

- [x] Domain test: LGO submission with one FY record rejected.
- [x] Domain test: two records with current + prior labels accepted.
- [x] Domain test: `youngMenCount` persisted and non-negative.
- [x] Application test: submit with two `FiscalYearRecord` entries succeeds.
- [x] Adapter test: POST LGO payload from revised shape returns success.
- [x] Dashboard/export tests updated for new field names where applicable.

## Blocked by

- [002-backend-admin-current-fiscal-year-setting.md](002-backend-admin-current-fiscal-year-setting.md)

## Related frontend issue

- [frontend/005-frontend-lgo-fiscal-year-admin-lock-and-two-year-comparison.md](../frontend/005-frontend-lgo-fiscal-year-admin-lock-and-two-year-comparison.md)
