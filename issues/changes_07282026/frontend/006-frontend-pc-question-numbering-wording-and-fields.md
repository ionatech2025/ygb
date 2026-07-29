## Objective

Revise the **Parish Chief (PC)** form: add **question numbering**, update section titles, effectiveness scale, gender split, multi-select hints, self-reliance wording, and programme improvement question.

Source questionnaire: [pc_questions.md](../../docs/suggested_changes/07282026/pc_questions.md).

## Target structure

### Section A — PDM Funds Receipt by the Parish
| Q | Issue |
|---|-------|
| 1 | Amount of PDM fund **expected** by the Parish/Ward |
| 2 | **Actual** amount PDM fund **received** |

### Section B — Access to PDM Fund
| Q | Issue |
|---|-------|
| 3 | Total number of beneficiaries in the Parish/Ward |
| 4 | Beneficiaries **under 30** who benefited from PDM |
| 5 | Young **women** under 30 who benefited |
| 6 | Young **men** under 30 who benefited *(new UI field)* |
| 7 | Obstacles constraining beneficiaries *(full sentence)* |
| 8 | Is spending targeted to those most in need? |

### Section C — Parish Development Committee (PDC)
| Q | Issue |
|---|-------|
| 8–11 | Membership counts (renumber consistently in UI) |
| 12 | PDC leadership/management training received? |
| 13 | Training areas (conditional) |
| 14 | PDC effectiveness — **Very effective / Effective / Moderately effective / Slightly effective / Not effective at all** |

### Section D — **PDM Programme** Monitoring and Oversight
*(renamed from "Monitoring and Oversight")*

| Q | Issue |
|---|-------|
| 15–20 | Monitoring parties **(select all that apply)**, method, report shared, improvements |

### Section E — Reporting & Self-Reliance
| Q | Issue |
|---|-------|
| 21–22 | Progress reports submitted / to whom |
| 23–26 | Self-reliance counts — rewrite as **full clear sentences** (agricultural enterprises, stable income, training, youth-led enterprises) |

### Closing
- **Programme improvement suggestion** — same clarified wording as other tools.

## Architectural Context

- **Frontend** — `src/adapters/primary/web/forms/pc/`, `pc-validation.ts`.
- Map new effectiveness enum values to backend 004 API.

## Acceptance Criteria & TDD Checklist

- [x] Component test: questions display S/No or Q numbers 1–26 + improvement question.
- [x] Component test: Section D title is "PDM Programme Monitoring and Oversight".
- [x] Component test: effectiveness dropdown shows five new labels only.
- [x] Component test: young men beneficiaries field visible in Section B.
- [x] Component test: monitoring question shows "(select all that apply)".
- [x] Component test: self-reliance questions use full-sentence labels from client doc.
- [x] Unit test: payload includes programme improvement narrative and new enum.

## Blocked by

- [001-frontend-cross-cutting-respondent-age-bracket-changes.md](001-frontend-cross-cutting-respondent-age-bracket-changes.md)
- [backend/004-backend-pc-effectiveness-scale-and-gender-split.md](../backend/004-backend-pc-effectiveness-scale-and-gender-split.md)
