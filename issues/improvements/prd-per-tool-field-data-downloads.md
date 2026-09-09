## Problem Statement

Public visitors can download open data today, but the download experience does not match what stakeholders need from field data:

1. **Wrong shape of data** — Public PDM export is a thin, mixed-form summary. Visitors who need **tool-specific field responses** (BYP, IYP, PC, LGO questionnaire, Budget Priorities, Budget Allocations) cannot cleanly choose one tool and get **all respondent answers**, including free-text.
2. **Confusing download surfaces** — Export buttons live on chart pages (PDM dashboard, Budget Priorities, LGO Budget Allocation). Visitors must hunt across pages; there is no single place to pick a dataset.
3. **Trust / privacy concern** — Programme owners do not want collector identity (or other hard PII) in public field-data files. Public extracts must stay free of respondent name/phone, collector name/id, and device identifiers, even when answer columns (including narratives) are expanded.
4. **Analytics coarseness** — Download-usage tracks coarse labels (`PDM`, `BUDGET_PRIORITIES`, `LGO_BUDGET_ALLOCATION`). After per-tool downloads, public and admin analytics should show **which tool** people actually take.
5. **Admin parity gap** — Admins still need today’s **identifiable submissions** export for operations, and also need the same **per-tool field extracts** the public gets (without inventing a second, conflicting schema).
6. **Missing improvement channel** — There is no lightweight way for downloaders to suggest platform improvements when they already complete a download profile.

## Solution

Introduce a **Download hub** for public and admin:

- Visitors open **`/download`**, choose **exactly one** tool dataset, optionally filter, and download **CSV or Excel**.
- Each file contains a **shared common header** (human-readable location and demographics metadata) plus **all answer columns for that tool, including free-text**.
- Hard PII is stripped from these tool files. Chart pages **no longer export**; they link to the hub.
- Public download-profile gating remains; the profile dialog gains an **optional improvement-feedback** field stored for **admins only**.
- Download-usage analytics move to **six fine-grained datasets**; historical `PDM` remains as **“PDM (legacy)”**.
- Admins get **`/admin/downloads`** with the **same tool files** as public, and keep the existing **submissions** export (CSV/Excel/PDF) on the admin dashboard.
- Old public download API routes are **removed / 410** in the same release as the hub.

## User Stories

1. As a public visitor, I want a dedicated Download page in the public navigation, so that I can find field-data downloads without hunting on chart pages.
2. As a public visitor, I want chart pages to link me to the Download hub instead of offering export buttons, so that there is one clear download journey.
3. As a public visitor, I want to choose exactly one dataset — BYP, IYP, PC, LGO, Budget Priorities, or Budget Allocations — so that I receive a file that contains only that tool’s responses.
4. As a public visitor, I want each download to be a separate file for the chosen tool, so that I do not receive a mixed multi-tool dump.
5. As a public visitor, I want the file to include all respondent answers for that tool, including free-text fields, so that I can analyse the field data in full.
6. As a public visitor, I want every tool file to start with the same common header fields (where applicable), so that I can join or compare extracts consistently.
7. As a public visitor, I want the common header to use district, sub-county, and parish **names** (not IDs), so that the file is readable without a location lookup table.
8. As a public visitor, I want gender, age group, financial year period, form type/dataset label, and form completed-at in the common header when the tool captures them, so that basic segmentation is possible without PII.
9. As a public visitor, I do not want respondent name, respondent phone, collector name, collector id, device submission id, row id, status, or location IDs in the public file, so that identity risk stays controlled.
10. As a public visitor, I want optional filters for district, sub-county, parish, gender, age group, and financial year before download, so that I can take a relevant slice instead of the entire dataset.
11. As a public visitor, I want empty filters to mean “all synced rows for that tool,” so that I can download the complete tool extract when needed.
12. As a public visitor, I want only synced server-accepted rows in tool downloads, so that open data reflects completed interviews.
13. As a public visitor, I want CSV and Excel for every tool on the hub, so that format choice is consistent.
14. As a public visitor, I want to complete the existing download-profile gate (email, demographics, consent) before downloading from the hub, so that open-data use can still be measured without creating an account.
15. As a public visitor, I want one valid download session to unlock hub downloads for that visit across tools, so that I am not re-prompted for every file.
16. As a public visitor, I want an optional free-text question on the download-profile dialog asking how the platform could improve, so that I can leave suggestions without a separate feedback product.
17. As a public visitor, I want that feedback question to be optional, so that I can still download if I have nothing to say.
18. As a public visitor, I want public download-usage charts to show the six tool datasets and downloads over time without my identity, so that open-data uptake is transparent.
19. As a public visitor, I want historical coarse PDM download counts to remain visible as “PDM (legacy),” so that past usage is not silently erased.
20. As a public visitor, I want deep links such as `/download?dataset=BYP` to preselect a tool, so that chart-page CTAs land on the right choice.
21. As an administrator, I want an Admin Download hub at `/admin/downloads`, so that I can obtain the same per-tool field extracts without using the public chrome.
22. As an administrator, I want admin tool extracts to use the **same columns** as public tool extracts, so that there is one canonical open-data-style schema.
23. As an administrator, I want to keep the existing admin submissions export (CSV/Excel/PDF) with identifiable fields as today, so that operational reporting still works.
24. As an administrator, I want admin hub downloads to require my admin JWT only (no download-profile dialog), so that staff are not blocked by the public gate.
25. As an administrator, I want download-usage analytics (admin and public aggregates) to record BYP, IYP, PC, LGO, Budget Priorities, and Budget Allocations separately, so that I can see which tools are requested.
26. As an administrator, I want to read optional improvement feedback with downloader profiles in the admin analytics/downloaders area, so that product suggestions are reviewable privately.
27. As an administrator, I do not want improvement feedback shown on the public dashboard, so that free-text cannot leak personal content publicly.
28. As a programme owner, I want old public download endpoints removed or returned as gone in the same release as the hub, so that thin/mixed exports cannot bypass the new contract.
29. As a frontend maintainer, I want chart export toolbars removed from PDM, Budget Priorities, and LGO Budget Allocation dashboards, so that UX matches the hub-only policy.
30. As a backend maintainer, I want a single export projection pipeline per tool (common header + tool answers − blocked PII), so that public and admin tool hubs share one implementation.
31. As a data consumer, I want Budget Priorities and Budget Allocations files to leave blank any common-header field the tool does not capture, so that the shared header shape still holds.
32. As a security reviewer, I want automated checks that public/admin tool extracts never include blocked PII headers/values, so that free-text expansion does not reintroduce collector or respondent identity columns.
33. As a QA engineer, I want filters to combine with AND semantics against synced rows of the selected tool only, so that downloads are predictable.
34. As a public visitor on mobile, I want the Download hub to work on small screens (tool chooser, filters, format buttons), so that field stakeholders can download without a desktop.
35. As an administrator, I want admin nav to expose Downloads separately from the operational submissions export entry, so that the two download jobs are not confused.

## Implementation Decisions

### Product / UX
- Public route: `/download` in public nav; chart pages replace exports with links to the hub (optional `dataset` query preselect).
- Admin route: `/admin/downloads` in admin nav; admin dashboard keeps existing submissions export toolbar/behaviour.
- Tool chooser (single select): BYP, IYP, PC, LGO (questionnaire), Budget Priorities, Budget Allocations (`LGO_BUDGET_ALLOCATION`).
- Formats: CSV and Excel for all six.
- Filters (optional): district, sub-county, parish, gender, age group, financial year period.
- Rows: synced only for tool hubs.
- Download profile gate remains for public hub; admin hub uses ADMIN JWT only.
- Optional improvement feedback on profile registration dialog; max length ~1000–2000 chars; admin-only visibility.

### Common header (canonical, names only)
- Dataset / form type label  
- District name  
- Sub-county name  
- Parish name  
- Gender  
- Age group  
- Financial year period  
- Form completed at  

**Excluded from tool hub files:** row id, status, location IDs, respondent name/phone, collector name/id, device submission id.

### Deep modules (preferred seams)
1. **Tool dataset catalogue** — enumerates the six downloadable datasets; maps UI labels ↔ storage form types / BP / allocation sources; drives analytics labels (including legacy `PDM` display).
2. **Field-data export query** — given dataset + filters, returns synced domain rows for that tool only (PDM submissions by form type, or BP / allocation repositories).
3. **Tool export projector** — builds tabular rows: common header + tool-specific answer columns (including free-text); applies PII column deny-list; blank missing common fields.
4. **Tabular file writer** — CSV/Excel writers reused for hub outputs (size/streaming considerations documented for free-text-heavy sheets).
5. **Public download gate + event recorder** — existing session validation; record download events with fine-grained dataset enum; register optional improvement feedback with profile.
6. **Download-usage aggregation** — public/admin charts understand six datasets + “PDM (legacy)” for historical events.
7. **Hub UI (public/admin)** — tool picker, filters, format actions, gated download flow (public) / JWT download (admin).

### API contract (conceptual)
- Public: `GET /api/v1/public/downloads/{dataset}/csv` and `.../excel` with filter query params; requires download session header; records usage.
- Admin: `GET /api/v1/admin/downloads/{dataset}/csv` and `.../excel` with same filters/columns; `ADMIN` role; no profile session.
- Profile register accepts optional `improvementFeedback` (or equivalent); persisted on profile (or linked one-to-one) for admin read APIs.
- Expand `PublicDownloadDataset` (or successor) to BYP, IYP, PC, LGO, BUDGET_PRIORITIES, LGO_BUDGET_ALLOCATION; retain legacy PDM for historical events only.
- Remove/410 legacy public dashboard download routes for PDM / BP / LGO allocation thin exports in the same release.

### Schema
- Flyway: add nullable improvement-feedback text on download profiles (or dedicated table keyed by profile id).
- Analytics/event storage: allow new dataset enum values; do not rewrite historical PDM rows.

### Architecture
- Hexagonal / ports & adapters; domain owns anonymisation/PII deny rules and dataset catalogue invariants.
- Public and admin tool hubs call the **same** projector + query modules; only auth and usage attribution adapters differ.
- Frontend: ports for hub download + profile register; no direct `fetch` in pages; TDD for hub UX and gate.

## Testing Decisions

- Test **external behaviour** (API status/headers/columns, UI flows, analytics labels), not private helpers or file layout internals beyond contractual columns.
- **Domain:** dataset catalogue; projector deny-list rejects blocked headers; common header blanks for tools missing demographics/location levels.
- **Application:** filter AND semantics; synced-only; session required on public hub; admin JWT path; download event records fine-grained dataset; optional feedback persisted and returned to admin only.
- **Adapters:** controller tests for public gate failure, admin 403 for non-admin, 410/absence of old download routes, CSV/Excel content-type and PII-free headers; repository/integration for feedback column and enum persistence.
- **Frontend:** hub tool selection + filters + format; chart pages have no export toolbar; profile dialog shows optional feedback; public charts show six datasets + legacy PDM label; admin hub mirrors without profile dialog.
- **Prior art:** public export toolbar / gated download tests, `AnonymisationProjector` header guards, Epic 9 download-usage public/admin charts, admin submissions export toolbar.

## Out of Scope

- Multi-select / zip of multiple tools in one action  
- Public display or moderation wall for improvement feedback  
- Changing the identifiable admin **submissions** export column set (kept as today)  
- Email OTP for download profiles  
- Village/zone in public/admin tool hub files  
- Date-range filter on the hub (can be a later enhancement)  
- Re-attributing historical `PDM` events into BYP/IYP/PC/LGO  
- Collector Field-app downloads  
- Third-party analytics products  

## Further Notes

- Expanding free-text into public files increases re-identification residual risk even with hard PII stripped; the deny-list and location grain (no village, names only) are intentional mitigations agreed in design.
- “LGO” on the hub means the **LGO questionnaire** tool; “Budget Allocations” means **LGO Budget Allocation** interviews — keep labels distinct in UI and analytics.
- Coordinate frontend and backend release: chart pages must not call removed endpoints.
- Natural follow-up after this PRD: break into backend/frontend issues under `issues/improvements/` (hub APIs, projector, analytics enum, profile feedback, public/admin hub UI, remove legacy export toolbars).
