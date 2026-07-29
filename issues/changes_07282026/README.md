# PDM Tools Change Requests — July 28, 2026

Client-requested updates from the July 28, 2026 Google Meet (Maryimmaculate Kiyai, Evelyn Mugisha, Patricia Nakitto, Samuel Katongole).

## Source documents

| Document | Purpose |
|----------|---------|
| [docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md) | Master change log (cross-cutting + per-tool) |
| [docs/suggested_changes/07282026/byp_questions.md](../../docs/suggested_changes/07282026/byp_questions.md) | Revised Beneficiary Young Person questionnaire |
| [docs/suggested_changes/07282026/iyp_questions.md](../../docs/suggested_changes/07282026/iyp_questions.md) | Revised Individual Young Person questionnaire |
| [docs/suggested_changes/07282026/lgo_questions.md](../../docs/suggested_changes/07282026/lgo_questions.md) | Revised Local Government Official questionnaire |
| [docs/suggested_changes/07282026/pc_questions.md](../../docs/suggested_changes/07282026/pc_questions.md) | Revised Parish Chief questionnaire |

## Issue breakdown

### Backend (`backend/`)

| # | Issue | Summary |
|---|-------|---------|
| 001 | Cross-cutting respondent & age bracket changes | Optional respondent name; remove `exactAge`; new 18–35 brackets |
| 002 | Admin current fiscal year setting | Admin-controlled active FY for LGO data collection |
| 003 | LGO two-year comparison & gender split | Two `FiscalYearRecord` entries; young men count; beneficiary wording |
| 004 | PC effectiveness scale & gender split | New effectiveness enum; young men beneficiaries; suggestions field |
| 005 | Location dataset naming corrections | Fix parish/sub-county/village label inconsistencies |
| 006 | Enumerator attribution verification | Confirm collector identity on every submission (test-only unless gap found) |

### Frontend (`frontend/`)

| # | Issue | Summary |
|---|-------|---------|
| 001 | Cross-cutting respondent & age bracket UI | Optional name; remove exact age; new bracket labels |
| 002 | Location dropdown label display | Reflect corrected location names from backend dataset |
| 003 | BYP question wording & fields | Full revised BYP copy from client doc |
| 004 | IYP question wording & fields | Full revised IYP copy; multi-select hints; Other specify |
| 005 | LGO fiscal year admin lock & two-year UI | Admin-selected FY; Q1–Q3 duplicated as (a)/(b) |
| 006 | PC question numbering, wording & fields | Numbered questions; effectiveness scale; section titles |
| 007 | Enumerator attribution verification | Manual/E2E checklist that admin sees collector per submission |

## Recommended implementation order

1. Backend 001 + Frontend 001 (shared foundations)
2. Backend 005 + Frontend 002 (location labels)
3. Backend 002 → Backend 003 → Frontend 005 (LGO fiscal year stack)
4. Backend 004 → Frontend 006 (Parish Chief)
5. Frontend 003 + Backend 001 BYP DTO alignment (BYP)
6. Frontend 004 (IYP — mostly copy/UX; schema largely unchanged)
7. Backend 006 + Frontend 007 (verification — no code unless testing finds gaps)

## Out of scope for code (client confirmed)

- Introductory-statement field (not needed — physical letter used)
- IYP conditional skip logic rework (confirmed working; enumerator clarity only)
