# Epic 8 — LGO Budget Allocation Form (Phase 2)

Issues for **US-LGOB-01** and **US-LGOB-02** from [`docs/user_stories.md`](../../docs/user_stories.md) and SRS v1.1 §4.8.

The **LGO Budget Allocation** module is a **standalone Phase 2 form**, distinct from the PDM **LGO Questionnaire** (`LgoForm` / Epic 2). Data Collectors interview Local Government Officials and record how the **previous financial year's budget was allocated across sectors**, the **rationale**, and **recommendations for the coming FY**. LGOs cannot self-submit (LGO-01). Aggregated, comparative results appear on the public dashboard (LGO-03) with CSV download (LGO-04).

**Phase note:** Epic 8 is Phase 2 backlog (not MVP). Issues are ready for sprint planning when Phase 2 starts.

API contract reference: [`backend/backend_docs/domain_arch_apis`](../../backend/backend_docs/domain_arch_apis) — LGO Budget Allocation section.

## Recommended implementation order

### Phase 1 — Domain & persistence foundation
1. [backend/001-backend-lgo-budget-allocation-domain-and-persistence.md](backend-issues/001-backend-lgo-budget-allocation-domain-and-persistence.md)

### Phase 2 — Collector submission flow (US-LGOB-01)
2. [backend/002-backend-lgo-budget-allocation-submission-api.md](backend-issues/002-backend-lgo-budget-allocation-submission-api.md)
3. [frontend/001-frontend-lgo-budget-allocation-collector-shell-and-routing.md](frontend-issues/001-frontend-lgo-budget-allocation-collector-shell-and-routing.md)
4. [frontend/002-frontend-lgo-budget-allocation-form.md](frontend-issues/002-frontend-lgo-budget-allocation-form.md)
5. [frontend/003-frontend-lgo-budget-allocation-submission-and-sync.md](frontend-issues/003-frontend-lgo-budget-allocation-submission-and-sync.md)

### Phase 3 — Public dashboard integration (US-LGOB-02)
6. [backend/003-backend-lgo-budget-allocation-dashboard-aggregation-apis.md](backend-issues/003-backend-lgo-budget-allocation-dashboard-aggregation-apis.md)
7. [backend/004-backend-lgo-budget-allocation-anonymised-export-apis.md](backend-issues/004-backend-lgo-budget-allocation-anonymised-export-apis.md)
8. [frontend/004-frontend-public-dashboard-lgo-budget-allocation-view.md](frontend-issues/004-frontend-public-dashboard-lgo-budget-allocation-view.md)
9. [frontend/005-frontend-public-dashboard-lgo-budget-allocation-export.md](frontend-issues/005-frontend-public-dashboard-lgo-budget-allocation-export.md)

### Phase 4 — Presentation polish
10. [frontend/006-frontend-lgo-budget-allocation-presentation-design.md](frontend-issues/006-frontend-lgo-budget-allocation-presentation-design.md)

## User story mapping

| User story | Backend issue(s) | Frontend issue(s) | Notes |
|------------|------------------|-------------------|-------|
| US-LGOB-01 Collector-only access (LGO-01) | 002 | 001 | `ProtectedRoute` + `DATA_COLLECTOR` role; TC-LGOB-01-01 |
| US-LGOB-01 Capture allocations, rationale, recommendations (LGO-02) | 001, 002 | 002, 003 | TC-LGOB-01-02 |
| US-LGOB-02 Comparative dashboard view (LGO-03) | 003 | 004 | TC-LGOB-02-01 |
| US-LGOB-02 CSV download (LGO-04) | 004 | 005 | TC-LGOB-02-02; CSV only per SRS |

## Test case mapping

| Test ID | Issue(s) | Notes |
|---------|----------|-------|
| TC-LGOB-01-01 | 002-backend, 001-frontend | Unauthenticated / public → 401 or redirect |
| TC-LGOB-01-02 | 001, 002, 002–003-frontend | Full field capture + persist |
| TC-LGOB-02-01 | 003, 004-frontend | Cross-district comparative visualisation |
| TC-LGOB-02-02 | 004, 005-frontend | CSV download |

## Dependencies on prior epics

- **Collector auth & layout** — Epic 1 (`ProtectedRoute`, `CollectorLayout`).
- **Respondent section & location** — Epic 2 shared form foundation ([008](../../epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md), [015](../../epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md)).
- **Offline queue & sync** — Epic 4 ([012](../../epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md), [013](../../epic-4-offline-sync/frontend-issues/013-frontend-background-sync-engine.md)).
- **Respondent uniqueness (optional)** — Epic 3 policy may apply to LGO respondent phone per FY; confirm with product before enforcing on this form type.
- **Public dashboard shell** — Epic 6 ([002](../../epic-6-public-dashboard/frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md), [007](../../epic-6-public-dashboard/frontend-issues/007-frontend-public-dashboard-presentation-design.md)).
- **Budget Priorities dashboard patterns** — Epic 7 filter/export UX ([004](../../epic-7-budget-priorities/frontend-issues/004-frontend-public-dashboard-budget-priorities-view.md), [005](../../epic-7-budget-priorities/frontend-issues/005-frontend-public-dashboard-budget-priorities-export.md)) as reference for LGO dashboard section.

## Out of scope (deferred / other epics)

- **PDM LGO Questionnaire** — existing `LgoForm` (Epic 2); not replaced by this epic.
- **LGO self-service submission** — explicitly forbidden (LGO-01).
- **Excel/PDF export for LGO data** — SRS specifies CSV only (LGO-04).
- **Admin CRUD for LGO Budget Allocation rows** — future enhancement.
- **Detailed sector allocation field list** — if not finalised by product, implement JSONB config with placeholder sectors; track copy in [require-polishing.md](../require-polishing.md).

## Related

- SRS: [../../docs/ygb_srs_v1.1.md](../../docs/ygb_srs_v1.1.md) §4.8
- User stories: [../../docs/user_stories.md](../../docs/user_stories.md) — Epic 8
- Budget Priorities (Epic 7): [../epic-7-budget-priorities/README.md](../epic-7-budget-priorities/README.md)
- PWA install prompt (collector UX): [../epic-4-offline-sync/frontend-issues/016-frontend-pwa-install-ygb-prompt.md](../epic-4-offline-sync/frontend-issues/016-frontend-pwa-install-ygb-prompt.md)
- Polishing backlog: [../require-polishing.md](../require-polishing.md)
