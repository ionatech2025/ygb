## Objective

Replace the current **MVP PDF export** (plain OpenPDF text tables in `PdfExportWriter`) with a **visually compelling, database-backed admin report** suitable for donors, government stakeholders, and programme reviews. The PDF should reflect the **same filtered dashboard dataset** as CSV/XLSX exports and include summary statistics, breakdown tables, and chart visualisations — not screenshots pasted from the UI. The tables should also be well-designed and color-coded to look appealing.

Today `GET /api/v1/admin/submissions/export?format=pdf` produces a basic document: title, filter description, and a few Helvetica tables (`totalSubmissions`, form type, gender). No branding, charts, district breakdowns, time series, or print-quality layout.

## Problem areas (confirmed)


| Gap              | Current behaviour                    | Target                                                                                                                        |
| ---------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Visual design    | Unstyled Helvetica paragraphs/tables | Branded cover, section hierarchy, colour accents, readable typography                                                         |
| Data coverage    | Summary + form type + gender only    | Full `DashboardAggregates` dimensions (districts top-N, FY periods, over-time trend, collector attribution where appropriate) |
| Charts           | None                                 | Bar/line/pie charts rendered server-side from aggregate data                                                                  |
| Filters          | Text description only                | Human-readable filter panel + applied date range / location hierarchy                                                         |
| Row-level detail | Not in PDF (by design)               | Optional appendix table (top N recent submissions) — confirm with product                                                     |


Reference: [epic-5 backend export issue](../../epic-5-admin-dashboard/backend-issues/004-backend-export-csv-excel-pdf.md) scoped MVP PDF as “summary stat table + filter description; full chart rendering may be later polish pass”. This issue is that polish pass.

## Architectural Context

- **Core domain** — optional value objects for `ReportSection`, `ChartSeries`, `ReportBranding` if layout logic grows; keep chart data derived from existing `DashboardAggregates`.
- **Application** — extend export use case / port to assemble a structured `AdminDashboardReportModel` from filter + aggregates (and optional submission sample).
- **Adapters (out/export)** — refactor `PdfExportWriter` into composable builders (cover page, KPI strip, vector chart renderer via OpenPDF `PdfPCellEvent`, tables). Charts are drawn with pure OpenPDF vector APIs (no raster chart library).
- **Adapters (in/rest)** — no contract change if `format=pdf` stays; response remains `application/pdf` stream honouring `DashboardFilter`.
- **Frontend** — no change required beyond existing “Generate PDF report” button; optional filename/metadata polish.



## Proposed approach



### 1. Report model (application layer)

Build a single report DTO from:

- `DashboardFilter` → `DashboardFilterDescriptionBuilder` (existing)
- `DashboardAggregates` → KPIs, breakdown lists, over-time series
- Metadata: generated at, fiscal year context, programme name, logo asset path



### 2. PDF layout sections

1. **Cover** — YGB branding, report title, filter summary, generation timestamp
2. **Executive summary** — total submissions, districts covered, date span, active filters
3. **Charts** (minimum):
  - Submissions over time (line or bar)
  - By form type (bar or pie)
  - By gender (bar)
  - Top districts (horizontal bar, top 2–10)
4. **Tables** — mirror chart data for accessibility / print
5. **Footer** — page numbers, “Youth Go Budget App — confidential” if required



### 3. Visual system

- Reuse programme colours (brand green `#359661`, NAC orange/blue from frontend tokens)
- Embed `pwa-512.png` or dedicated print logo from `backend/src/main/resources`
- A4 portrait, consistent margins, section breaks



### 4. Tests (TDD)

- **Unit:** report model builder maps aggregates → chart/table datasets correctly
- **Unit:** PDF writer produces non-empty byte stream; contains expected section titles (parse text from PDF or golden-file byte length threshold)
- **Integration:** `@WebMvcTest` or existing `AdminSubmissionControllerTest` PDF export returns 200 + `application/pdf`; filtered export reflects filter description in extracted text
- **Regression:** export still completes within timeout for typical aggregate sizes



## Acceptance Criteria & TDD Checklist

- [x] PDF includes branded cover and executive summary derived from live DB aggregates (not hard-coded).
- [x] PDF includes at least **four chart visualisations** aligned with public/admin dashboard metrics.
- [x] PDF includes well-designed and colored tabular breakdowns for form type, gender, top districts, and financial year period (when data present).
- [x] Export honours active `DashboardFilter` (same as CSV/XLSX).
- [x] Unit tests for report model assembly and PDF section rendering.
- [x] Controller/integration test confirms PDF response headers and non-zero body.
- [ ] Manual QA: open PDF in Acrobat/browser — readable on A4, charts not clipped, filters described in plain language.



## Out of scope

- Client-side PDF generation in the browser
- Public/anonymised PDF export (admin only)
- Email delivery / scheduled reports



## Blocked by

None — builds on existing export endpoint and `DashboardAggregates` pipeline.

## Related

- [epic-5/004-backend-export-csv-excel-pdf.md](../../epic-5-admin-dashboard/backend-issues/004-backend-export-csv-excel-pdf.md) — original export MVP
- [US-DASH-05 in docs/user_stories.md](../../../docs/user_stories.md) — stakeholder reporting user story
- Frontend export toolbar: `DashboardExportToolbar.tsx`

