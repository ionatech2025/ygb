## Problem Statement

Public PDM, Budget Priorities, and LGO Budget Allocation data can already be downloaded as CSV/Excel without login, but the programme cannot tell **who** uses that open data, how often downloads happen, or how download activity compares to general site traffic. Donors and admins need usage evidence in dashboards and PDF reports, while public visitors still need friction-aware access (no account creation) and privacy-safe public charts.

## Solution

Require a short **download profile** (country, gender, age bracket, field of operation, validated email, optional name, consent) before any public CSV/Excel download. Issue a short-lived **download session** that unlocks PDM, Budget Priorities, and LGO exports for the same visit. Record each download and anonymous public page visits. Expose admin tables/charts (with PII), public anonymised usage charts, and aggregate-only PDF sections for donors.

## User Stories

1. As a public user, I want to provide my country, gender, age bracket, field of operation, email, optional name, and consent before downloading public PDM / Budget Priorities / LGO data as CSV or Excel, so that I can access open data without creating an account while the programme can understand who uses it.
2. As a public user, I want one completed profile to unlock downloads for that visit across PDM, Budget Priorities, and LGO Budget Allocation, so that I am not forced to re-enter the form for every file.
3. As a public user, I want my email to be validated for format (without OTP), so that bad addresses are rejected without blocking me with verification friction.
4. As an administrator, I want to see who downloaded public datasets (including email and optional name) and view their demographics graphically with filters by age bracket and gender, so that I can report on open-data users.
5. As an administrator, I want to see how many people visit the public site and compare that graphically with downloaders, so that I can judge engagement vs data uptake.
6. As an administrator, I want visitor and download aggregates included in the generated PDF report, so that I can share usage evidence with donors without exporting contact lists in the PDF.
7. As a public user, I want to see anonymised charts of how widely public dashboard data is downloaded (PDM vs Budget Priorities, and LGO where applicable), so that open-data use is transparent without exposing anyone’s identity.

## Implementation Decisions

- **Gate all public CSV/Excel** endpoints (PDM, Budget Priorities, LGO Budget Allocation) behind a download session issued after successful profile registration.
- **No login account** required; profile is not a user account. Session lifetime ~1 hour (or end of browser session), stored client-side and validated server-side (opaque token).
- **Profile fields:** ISO country (searchable), existing gender + age-bracket enums, field-of-operation fixed list (Academia/Research, Government, NGO/CSO, Donor/Development partner, Media, Private sector, Student, Other + specify), email (RFC-style validation, no OTP), optional name, required consent checkbox + purpose notice.
- **Each download** creates a download event (dataset, format, timestamp, filters summary optional) linked to the profile/session.
- **Visit beacons:** first-party anonymous page-view/session events on public routes; privacy notice; no third-party trackers in this epic.
- **Admin UI:** downloader table with PII + aggregate charts; age/gender filters mandatory for charts; additional filters (country, field, dataset) allowed if natural.
- **Public UI:** anonymised aggregates only — downloads over time and by dataset comparison; never emails/names/visitor identities.
- **PDF:** aggregate sections only (visitors, downloaders, by dataset, demographic breakdowns) — no contact appendix.
- **Architecture:** Hexagonal — domain models for profile, session, download event, visit event; application use cases; REST adapters; MapStruct DTOs; Flyway migrations; frontend ports/adapters for APIs.

## Testing Decisions

- Prefer tests of external behaviour (API contracts, UI flows, PDF section presence) over implementation details.
- Domain: profile validation (email, consent, field-of-operation Other specify), session expiry rules.
- Application: register profile issues session; export without session rejected; export with session records event; visit beacon idempotency/session bucketing as designed.
- Adapters: controller/integration tests for gate (401/403 without token), admin analytics filters, public aggregation has no PII keys.
- Frontend: form required before export; session reuse across datasets; admin charts filter by age/gender; public charts render without PII.
- Prior art: public export toolbar tests, admin PDF writer tests, Budget Priorities export adapters.

## Out of Scope

- Email OTP / magic-link verification
- Third-party web analytics products
- Downloader PII on public dashboard or in PDF
- Changing columns/anonymisation of the downloaded survey datasets
- Collector/admin authentication changes

## Further Notes

- Updates the prior “download by anyone with no friction” interpretation of US-PUB-04 / US-BP-02 / US-LGOB-02: still no login account, but profile + consent required.
- Field-of-operation option labels may be refined with the client without changing the epic structure.
