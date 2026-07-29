## Objective

Revise the **Individual Young Person (IYP)** form copy and UX to match the client-approved revised questionnaire. Conditional skip logic (Q1→Q14, Q6→Q9, etc.) ** stays as implemented** — only clarity, hints, and missing controls are updated.

Source questionnaire: [iyp_questions.md](../../docs/suggested_changes/07282026/iyp_questions.md).

## Sections & questions (target)

### Section A — PDM Awareness & Information

| Q | Question | Notes |
|---|----------|-------|
| Q1 | Are you aware of the PDM programme in your parish or district? | Aware → Q2; Unaware → Q14 |
| Q2 | How did you get information about the PDM programme? | **(select all that apply)**; Other specify text box |
| Q3 | Are you aware of the eligibility criteria of PDM being implemented in your area? | Hidden when Q1 = Unaware |
| Q4 | Do you know about the process of accessing PDM funds? | |
| Q5 | In your view, was the information about PDM adequately disseminated in your community? | |

### Section B — Application & Access

| Q | Question | Notes |
|---|----------|-------|
| Q6 | Have you applied for the PDM fund? | Yes → Q7; No → Q9 |
| Q7 | Did you access the PDM fund after your application? | |
| Q8 | Outcome of application (if Q6=Yes) | Rejection explanation when rejected |
| Q9 | Reasons for not applying (if Q6=No) | **(select all that apply)**; Other specify |
| Q10 | Difficulties faced accessing PDM fund | **(select all that apply)**; Other specify; limitation explain field |
| Q11 | Are people receiving funds the right ones? | |
| Q12 | Know youth-targeted portion of PDM? | |
| Q13 | Opinion on government implementation | **(select all that apply)**; Other specify |

### Section C — If Unaware (Q1=Unaware)

| Q | Question |
|---|----------|
| Q14 | Why no information received? **(select all that apply)** |
| Q15 | Would you like more information? |

### Closing

| Q16 | What should be improved to make the **PDM programme** more efficient and effective in your community? |

## Architectural Context

- **Frontend** — `src/adapters/primary/web/forms/iyp/` sections, `iyp-validation.ts`, conditional hooks.
- Display **question numbers** (Q1–Q16) in section headers for enumerator clarity.

## Acceptance Criteria & TDD Checklist

- [x] Component test: Q2 and Q10 show "(select all that apply)" hint.
- [x] Component test: Q2/Q9/Q10 Other options reveal text inputs (Q13/Q14 N/A — not in backend/form).
- [x] Component test: existing skip logic tests still pass (Q1 unaware, Q6 no apply, etc.).
- [x] Component test: Q16 programme-improvement wording updated.
- [x] Question numbers visible in UI (Q1–Q10, Q16 in labels).

## Blocked by

- [001-frontend-cross-cutting-respondent-age-bracket-changes.md](001-frontend-cross-cutting-respondent-age-bracket-changes.md)
