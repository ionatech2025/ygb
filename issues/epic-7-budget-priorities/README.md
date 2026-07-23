# Epic 7 — Budget Priorities Module (Phase 2)

Issues for **US-BP-01** and **US-BP-02** from [`docs/user_stories.md`](../../docs/user_stories.md) and SRS v1.1 §4.7.

The Budget Priorities module lets **members of the public** (no login) submit one of four sectoral forms — **Health**, **Agriculture**, **Education**, **Climate** — with phone number captured on the form and uniqueness enforced **per section per financial-year period at submit time**. Aggregated, anonymised results appear on the public dashboard alongside PDM data (Epic 6).

**Budget constraint (July 2026):** SMS/OTP phone verification (SRS BP-02, TC-BP-01-01) is **deferred** to [future-features.md](../future-features.md) FF-01. Epic 7 ships without OTP.

API contract reference: [`backend/backend_docs/domain_arch_apis`](../../backend/backend_docs/domain_arch_apis) — Budget Priorities section (submit + dashboard; `verify-phone` deferred).

**Phase note:** Epic 7 is Phase 2 backlog (not MVP). Issues are ready for sprint planning when Phase 2 starts.

## Recommended implementation order

### Phase 1 — Domain & persistence foundation
1. [backend/001-backend-budget-priority-domain-and-persistence.md](backend-issues/001-backend-budget-priority-domain-and-persistence.md)

### Phase 2 — Public submission flow (US-BP-01)
2. [backend/002-backend-budget-priority-submission-api.md](backend-issues/002-backend-budget-priority-submission-api.md)
3. [frontend/001-frontend-budget-priorities-shell-and-sector-navigation.md](frontend-issues/001-frontend-budget-priorities-shell-and-sector-navigation.md)
4. [frontend/002-frontend-budget-priority-sector-forms.md](frontend-issues/002-frontend-budget-priority-sector-forms.md)
5. [frontend/003-frontend-budget-priority-submission-feedback.md](frontend-issues/003-frontend-budget-priority-submission-feedback.md)

### Phase 3 — Public dashboard integration (US-BP-02)
6. [backend/003-backend-budget-priority-dashboard-aggregation-apis.md](backend-issues/003-backend-budget-priority-dashboard-aggregation-apis.md)
7. [backend/004-backend-budget-priority-anonymised-export-apis.md](backend-issues/004-backend-budget-priority-anonymised-export-apis.md)
8. [frontend/004-frontend-public-dashboard-budget-priorities-view.md](frontend-issues/004-frontend-public-dashboard-budget-priorities-view.md)
9. [frontend/005-frontend-public-dashboard-budget-priorities-export.md](frontend-issues/005-frontend-public-dashboard-budget-priorities-export.md)

### Phase 4 — Presentation polish
10. [frontend/006-frontend-budget-priorities-presentation-design.md](frontend-issues/006-frontend-budget-priorities-presentation-design.md)

## User story mapping

| User story | Backend issue(s) | Frontend issue(s) | Notes |
|------------|------------------|-------------------|-------|
| US-BP-01 Phone verification gate (BP-02) | — | — | **Deferred** → [FF-01](../future-features.md) |
| US-BP-01 Block duplicate per section per FY (BP-02) | 001, 002 | 003 | Enforced at submit (409) |
| US-BP-01 Allow different section, same phone (BP-03) | 001, 002 | 002, 003 | |
| US-BP-01 Public sectoral forms without login (BP-01) | 002 | 001, 002 | |
| US-BP-02 Dashboard section by sector (BP-04) | 003 | 004 | |
| US-BP-02 CSV/Excel download (BP-04) | 004 | 005 | |

## Test case mapping

| Test ID | Issue(s) | Notes |
|---------|----------|-------|
| TC-BP-01-01 Phone verification gate | — | Deferred → [FF-01](../future-features.md) |
| TC-BP-01-02 Block duplicate per section per FY | 001, 002, 003-frontend | Submit-time 409 |
| TC-BP-01-03 Allow different section, same phone | 001, 002, 002–003-frontend | |
| TC-BP-02-01 Dashboard section exists | 003, 004-frontend | |
| TC-BP-02-02 Downloadable data | 004, 005-frontend | |

## Dependencies on prior epics

- **Financial year period** — reuse `FinancialYearPeriod` value object and calculator from Epic 3 ([014-frontend-financial-year-period-domain.md](../epic-3-respondent-uniqueness/frontend-issues/014-frontend-financial-year-period-domain.md)).
- **Uganda phone validation** — reuse existing phone utilities (Epic 1 auth / Epic 2 forms).
- **Public dashboard shell** — extend Epic 6 public layout and theme ([002-frontend-public-dashboard-shell-and-navigation.md](../epic-6-public-dashboard/frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md), [007-frontend-public-dashboard-presentation-design.md](../epic-6-public-dashboard/frontend-issues/007-frontend-public-dashboard-presentation-design.md)).
- **Anonymisation patterns** — mirror Epic 6 `AnonymisationProjector` and public export approach ([001](../epic-6-public-dashboard/backend-issues/001-backend-public-dashboard-security-and-filter-model.md), [003](../epic-6-public-dashboard/backend-issues/003-backend-public-anonymised-export-apis.md)).

## Out of scope (deferred / other epics)

- **SMS/OTP phone verification** — [future-features.md FF-01](../future-features.md#ff-01--budget-priorities-sms--otp-phone-verification)
- LGO Budget Allocation form and dashboard views (US-LGOB-* / [Epic 8](../epic-8-lgo-budget-allocation/README.md))
- Admin management of Budget Priorities submissions
- **Detailed sector-specific priority-area question lists** — if not finalised by product, implement as JSONB config with placeholder options; final copy tracked in [require-polishing.md](../require-polishing.md)

## Related

- Deferred features: [../future-features.md](../future-features.md)
- SRS: [../../docs/ygb_srs_v1.1.md](../../docs/ygb_srs_v1.1.md) §4.7
- Public dashboard (Epic 6): [../epic-6-public-dashboard/README.md](../epic-6-public-dashboard/README.md)
- Polishing backlog: [../require-polishing.md](../require-polishing.md)
