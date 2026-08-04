## Objective

Make **Local Government Official (LGO) Questionnaire Questions 1–3** (“Financial & coverage data”) usable **offline**, matching the product rule that **all collector forms must load without network**.

Today the section hard-depends on a live call to `GET /api/v1/public/settings/fiscal-year`. When the device is offline (or the request fails), `LgoForm` surfaces **Failed to fetch** / load-failed UI, leaves Q1–3 empty, and disables submit — even though respondent, location, and later LGO sections can still be filled.

## Problem (confirmed)

| Area | Current behaviour |
|------|-------------------|
| `LgoForm.tsx` | `useEffect` / `resetForm` call `fetchPublicActiveFiscalYear()` with no cache fallback |
| `LgoFiscalYearSection.tsx` | Shows `loadError` (e.g. “Failed to fetch”); Q1–3 blocks only render when `reportingFiscalYearLabel` is set |
| `fiscal-year-settings-api.adapter.ts` | Thin `apiFetch` only — no persistence |
| Location / auth offline paths | Locations + session already survive offline; **active fiscal year does not** |

Screenshot: Q1–3 section header visible with admin FY label when online; offline collectors see load failure instead of the two-year input blocks.

## Architectural Context

- **Frontend adapters (secondary)** — extend fiscal-year settings access with a cache (localStorage or IndexedDB), similar in spirit to `LocationService` / location ETag cache.
- **Frontend adapters (primary/web)** — `LgoForm` loads FY via cached-then-network (or network-with-cache-fallback); never block the whole Q1–3 surface when a stale-but-valid cached setting exists.
- **Core domain** — reuse `ActiveFiscalYearSetting` / `createLgoFieldsFromActiveFiscalYear`; no domain rule changes.
- **Backend** — none required for this fix (public FY endpoint already exists). Optional later: Service Worker caching of that GET is out of scope unless already used for other public GETs.

## Proposed approach

1. **Persist** successful public fiscal-year responses (label, prior label, supported labels as returned today).
2. **On LGO mount / reset:**
   - Prefer network when online; on success, refresh cache and build Q1–3 fields.
   - On network failure (offline / “Failed to fetch”), **hydrate from cache** and clear the blocking load error.
   - Only show a hard load error when **both** network and cache fail (first install never online).
3. **Keep admin path unchanged** for this issue (`AdminFiscalYearSettingsPanel` can stay online-only); collector PWA is the priority.
4. **Invalidate / overwrite** cache whenever a successful online fetch returns a newer setting so collectors who were online once get the admin-set year for field work.

## Technical Constraints & Clean Code

- Keep `LgoForm` thin: cache read/write lives in secondary adapter or a small core helper, not inline `localStorage` calls scattered in the form.
- File size / nesting limits per project standards.
- Do not invent a fiscal year when cache is empty — fail clearly with guidance to connect once.

## Acceptance Criteria & TDD Checklist

- [ ] **Adapter / unit test:** successful `fetchPublicActiveFiscalYear` persists setting for later reads.
- [ ] **Adapter / unit test:** when `apiFetch` rejects with a network failure and cache is present, loader returns cached `ActiveFiscalYearSetting`.
- [ ] **Adapter / unit test:** when network fails and cache is empty, error still propagates (no silent empty FY).
- [ ] **Component test (`LgoForm`):** offline (mocked fetch rejection + seeded cache) renders Q1–3 blocks for admin-set + prior FY; no “Failed to fetch” alert; submit not disabled solely due to FY load error.
- [ ] **Component test:** offline with empty cache still shows a clear load error (cannot invent FY).
- [ ] **Regression:** online path still fetches live setting and updates Q1–3 labels after admin change (when collector has connectivity).
- [ ] Manual QA (PWA): go online once → open LGO → go offline → reopen LGO → Q1–3 editable and submittable to offline queue.

## Out of scope

- Changing Q1–3 question wording or validation rules.
- Offline editing of admin fiscal-year settings.
- Backend API changes.

## Blocked by

None — can start immediately.

## Related

- [fixes/on_08042026/README](../README.md)
- [changes_07282026/frontend/005](../../changes_07282026/frontend/005-frontend-lgo-fiscal-year-admin-lock-and-two-year-comparison.md)
- [changes_07282026/backend/002](../../changes_07282026/backend/002-backend-admin-current-fiscal-year-setting.md)
