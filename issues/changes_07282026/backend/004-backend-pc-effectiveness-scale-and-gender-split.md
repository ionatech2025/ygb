## Objective

Update the **Parish Chief (PC) submission model** for client-requested structural and field changes:

1. **Young men beneficiary count** — explicit field alongside young women (cross-cutting item 13).
2. **PDC effectiveness rating** — replace ambiguous scale (`Fully/Mostly/Some/Hardly/None`) with: **Very effective / Effective / Moderately effective / Slightly effective / Not effective at all**.
3. **Suggestions for improvement** — ensure PC submissions capture programme-level improvement suggestions (same wording as other tools).
4. Support revised **self-reliance** numeric questions with full-sentence labels (frontend copy; backend keeps integer fields with updated validation messages).

Reference: [pc_questions.md](../../docs/suggested_changes/07282026/pc_questions.md), [PDM_Tools_Change_Requests_07282026.md §5](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Revised PC question outline (for schema alignment)

| Section | Topics |
|---------|--------|
| A — PDM Funds Receipt | Q1 expected amount, Q2 actual received |
| B — Access to PDM Fund | Q3 total beneficiaries, Q4 beneficiaries under 30, Q5 young women under 30, **Q6 young men under 30**, Q7 obstacles, Q8 spending targeted |
| C — PDC | Q8–14 membership, training, **effectiveness rating (new enum)** |
| D — Monitoring & Oversight | Q15–20 monitoring parties (multi-select), methods, improvements |
| E — Reporting & Self-Reliance | Q21–26 reporting + self-reliance counts |
| — | **Programme improvement suggestion** (narrative) |

Renumbering is primarily a **frontend concern**; backend stores ordered fields / enums consistently.

## Architectural Context

- **Core Domain**
  - Add `youngMenBeneficiaries` to `PcSubmission`.
  - Replace free-text `pdcEffectivenessRating` with enum `PdcEffectivenessRating` (five values above).
  - Add `NarrativeText programmeImprovementSuggestion` if not already mapped from existing improvement field.

- **Application / Adapters**
  - Update `PcSubmitCommand`, DTO, JPA entity, mappers.
  - Flyway: migrate existing effectiveness strings if any production data exists (map old → new or nullable during transition).

## Acceptance Criteria & TDD Checklist

- [x] Domain test: invalid effectiveness enum rejected.
- [x] Domain test: young men count required and non-negative when youth beneficiaries > 0.
- [x] Application test: submit PC with new enum succeeds.
- [x] Adapter test: POST PC with new payload shape; old effectiveness values rejected with 400.
- [x] Admin submission detail mapper shows new fields.

## Blocked by

- [001-backend-cross-cutting-respondent-age-bracket-changes.md](001-backend-cross-cutting-respondent-age-bracket-changes.md)

## Related frontend issue

- [frontend/006-frontend-pc-question-numbering-wording-and-fields.md](../frontend/006-frontend-pc-question-numbering-wording-and-fields.md)
