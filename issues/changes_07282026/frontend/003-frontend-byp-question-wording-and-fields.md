## Objective

Revise the **Beneficiary Young Person (BYP)** form copy, labels, and field behaviour to match the client-approved questionnaire and July 28 change requests.

Source questionnaire: [byp_questions.md](../../docs/suggested_changes/07282026/byp_questions.md).

## Question set (target UI copy)

| # | Question |
|---|----------|
| 1 | How long did it take you to receive your funds? *(options: a week; more than a week and less than a month + specify; a month; months + specify)* |
| 2 | Did you get the actual amount of money you requested? (Yes/No) |
| 3 | How much cash did you get? |
| 4 | What is the **instalment period for receiving funds**? *(Monthly / Quarterly / Biennially / Annual / Other specify)* — rephrase per client: clarify this is about **receiving**, not repaying |
| 5 | How would you rate the quality of services provided by the Parish Chief/Town Agent and **Parish Development Committee (PDC)** at the parish or ward level? |
| 6 | What do you think about the performance of PDM in this parish? |
| 7 | Do you think your group was organized transparently? |
| 8 | Did you receive any business development services? If yes, specify: Training… / Market linkages / Extension service *(multi-select when Yes)* |
| 9 | What do you think should be improved to make the **PDM programme** efficient and effective? |

Demographics header: Name (optional), Age bracket, Gender, District, Sub-county, Contact — **no exact age field**.

## Change-request extras (from master doc)

- Add **"(select all that apply)"** on Q8 multi-select.
- Ensure **Other (specify)** on Q4 has a visible text box.
- Unpack terse labels into full plain-English sentences where current UI is abbreviated.

## Architectural Context

- **Frontend Primary Adapters** — `src/adapters/primary/web/forms/byp/` sections and `byp-validation.ts`.
- Payload must stay aligned with backend BYP DTO after cross-cutting backend changes.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: Q4 label mentions receiving funds / instalment period wording updated.
- [ ] Component test: Q5 spells out Parish Development Committee.
- [ ] Component test: Q8 shows multi-select hint; Other specify on Q4 works.
- [ ] Component test: Q9 label references PDM **programme** improvement.
- [ ] Unit test: payload shape matches backend DTO without `exactAge`.
- [ ] Visual review against [byp_questions.md](../../docs/suggested_changes/07282026/byp_questions.md).

## Blocked by

- [001-frontend-cross-cutting-respondent-age-bracket-changes.md](001-frontend-cross-cutting-respondent-age-bracket-changes.md)
