## Objective

Extend the **admin PDF report** with aggregate sections for site visitors and public dataset downloads (by dataset and key demographics), suitable for donor sharing — **without** a contact/email appendix.

## Architectural Context

- **Adapters (out/export):** extend OpenPDF report builder used by admin Generate PDF.
- **Application:** assemble usage summary from analytics queries (reuse 005 read models where possible).

## Technical Constraints & Clean Code

- Aggregate-only: totals, visitors vs downloaders, downloads by dataset, age/gender (and optionally field/country) breakdowns.
- Respect current dashboard filters for submission data; usage section may be global or date-bounded — document choice in implementation (prefer same date-from/to filter when present).
- No email/name table in PDF.

## Acceptance Criteria & TDD Checklist

- [ ] PDF text/section titles include visitor and download usage headings.
- [ ] PDF contains aggregate figures/charts for usage; extracted text has no sample email addresses from fixtures unless accidentally in other sections.
- [ ] Unit tests for usage section model assembly; integration/PDF generation smoke test.
- [ ] Existing submission PDF sections remain intact.

## Blocked by

- [005-backend-admin-download-usage-analytics-apis.md](005-backend-admin-download-usage-analytics-apis.md)

## Related

- US-DL-04 · [ui_fixes PDF enhancement](../../fixes/ui_fixes_07292026/backend/003-backend-admin-pdf-report-enhancement.md)
