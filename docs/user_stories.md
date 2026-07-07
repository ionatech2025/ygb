# YGB SURVEY TOOL

Parish Development Model (PDM) Monitoring & Data Collection Platform

**USER STORIES, ACCEPTANCE CRITERIA & TEST CASES**

*Development-Ready Backlog — Derived from SRS v1.1 (23 June 2026)*

Prepared for: NAC — Youth Go Budget (YGB) Programme

Source documents: YGB Survey Tool SRS v1.1, YGB Survey Tool Requirements v1.0, PDM field forms (BYP, IYP, LGO, Parish Chief)

Date: July 2026

---

# How to Use This Document

This backlog translates the YGB Survey Tool SRS (v1.1, the authoritative, client-approved version) and the source PDM paper forms into development-ready user stories. Each story includes a role/goal/benefit statement, Given/When/Then acceptance criteria, and an explicit test-case table (ID, description, steps, expected result) that QA and developers can use directly for test-driven development and sprint planning.

**Scope note:** Epics 1–6 are Phase 1 MVP (Must/Should Have, per SRS v1.1 §8 Phasing Summary). Epics 7–8 (Budget Priorities module and LGO Budget Allocation form) are Phase 2 and are included for backlog/roadmap visibility only — they are out of scope for the current sprint cycle.

**Traceability:** Each story references its originating SRS requirement ID(s) (e.g. AUTH-01, FORM-02, SYNC-03) so it can be cross-checked against the SRS during review.

**Key SRS v1.1 updates reflected here (23 June 2026 client meeting):**

- No Data Collector self-registration — Admins create all Data Collector accounts.
- PDM survey forms (BYP/IYP/LGO/Parish Chief) are accessible ONLY to authenticated Data Collectors, not the public.
- Respondent phone number is unique per form type per financial-year period (Jan–Jun / Jul–Dec), enforced client- and server-side.
- Admin Dashboard includes a Data Collector Tracker (leaderboard) with multi-dimension filters.
- Public Dashboard must be highly interactive, modern/elaborate in design, support raw CSV/Excel download by anyone, and reflect filter state in a shareable URL.
- Budget Priorities module and LGO Budget Allocation form are deferred to Phase 2.

---

# EPIC 1 — Authentication & User Account Management

*Covers how Data Collector and Administrator accounts are created, secured, and used to gate access to survey forms and admin functions. Data Collectors do NOT self-register (SRS v1.1 update, 23 June 2026) — all accounts are created by an Administrator.*

## US-AUTH-01 — Admin creates a Data Collector account

**Priority: Must Have** *SRS Reference: AUTH-01*

*As a **Administrator**, I want **to create a Data Collector account by entering their Full Name, Phone Number, and a password (system-generated or manually assigned)**, so that **the Data Collector can be issued credentials and start collecting field data, and I retain control over who is authorized to submit data**.*

**Notes:** *Self-registration is explicitly disallowed per the 23 June 2026 client meeting. Credentials are shared with the collector out-of-band (e.g. verbally, SMS, printed slip) — the system itself does not need to email/SMS the password unless NOTIF requirements later require it.*

### Acceptance Criteria

- Given I am logged in as an Administrator, when I open 'Manage Users' and select 'Add Data Collector', then a form requesting Full Name, Phone Number, and Password is displayed.
- Given I submit the form with a Phone Number that is not already registered, when I click Save, then a new Data Collector account is created with role = DATA_COLLECTOR and is_active = true.
- Given I submit the form with a Phone Number that already exists in the system, when I click Save, then the system rejects the submission and displays 'Phone number already registered'.
- Given I submit the form with a missing required field (name, phone, or password), when I click Save, then the system blocks submission and highlights the missing field(s).
- Given a Data Collector account has been created, when I view the Users list, then the new account appears with status Active and no submissions yet.
- There is no publicly accessible registration screen or API endpoint for Data Collectors to self-register.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-AUTH-01-01 | Create valid Data Collector account | Login as Admin → Manage Users → Add Data Collector → enter Name='Jane Nakato', Phone='0772123456', Password='Passw0rd!' → Save | Account created; appears in Users list with role DATA_COLLECTOR, status Active. |
| TC-AUTH-01-02 | Duplicate phone number rejected | Attempt to create a second account using an already-registered phone number | System blocks creation and shows a duplicate-phone error; no second account created. |
| TC-AUTH-01-03 | Missing required field | Attempt to save the Add Data Collector form leaving Password blank | Form is not submitted; inline validation error shown on Password field. |
| TC-AUTH-01-04 | No self-registration route exists | As an unauthenticated user, attempt to navigate to any 'register' or 'sign up' URL / call any public registration API | No such route exists (404) or the route is not exposed; Data Collector accounts can only be created from an authenticated Admin session. |

---

## US-AUTH-02 — Data Collector logs in (online and offline)

**Priority: Must Have** *SRS Reference: AUTH-02*

*As a **Data Collector**, I want **to log in with my phone number and password, and remain able to log in even without connectivity after my first successful online login**, so that **I can access and complete survey forms in rural areas with no network coverage**.*

**Notes:** *Offline auth likely relies on a locally cached, encrypted credential/session token (see SYNC and Security NFRs). JWT access tokens expire after 24h, refresh tokens after 30 days.*

### Acceptance Criteria

- Given valid credentials and an internet connection, when I submit the login form, then I am authenticated, a JWT access + refresh token pair is issued, and I land on the PDM entry screen.
- Given invalid credentials, when I submit the login form, then I see a clear 'invalid phone number or password' error and remain on the login screen.
- Given I have logged in successfully at least once while online, when I open the app with no connectivity, then I can still log in using the same credentials and reach the survey forms.
- Given I have never logged in successfully online on this device, when I attempt to log in offline, then the system denies access and explains that an initial online login is required.
- Given my access token has expired but my refresh token is still valid and I am online, when I use the app, then the token is silently refreshed without forcing a re-login.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-AUTH-02-01 | Online login success | Enter correct phone+password while online → Login | Redirected to PDM entry screen; tokens stored. |
| TC-AUTH-02-02 | Online login failure | Enter incorrect password → Login | Error message shown; no token issued; user stays on login screen. |
| TC-AUTH-02-03 | Offline login after prior online login | Log in online once, log out, switch device to Airplane Mode, log in again with same credentials | Login succeeds offline; user reaches PDM entry screen. |
| TC-AUTH-02-04 | Offline login with no prior online session | On a freshly installed app (no prior login), enable Airplane Mode, attempt login | Login is blocked with a message requiring an initial online login. |
| TC-AUTH-02-05 | Token refresh | Remain logged in and active in the app until the 24h access token expires while online | App silently obtains a new access token via the refresh token; user is not logged out. |

---

## US-AUTH-03 — Only existing Administrators can create new Administrator accounts

**Priority: Must Have** *SRS Reference: AUTH-03*

*As a **Administrator**, I want **new Admin accounts to be creatable only by an existing Admin**, so that **administrative access to the platform stays tightly controlled**.*

### Acceptance Criteria

- Given I am logged in as an Admin, when I access 'Manage Users' → 'Add Administrator', then I can create a new account with role = ADMIN.
- Given I am logged in as a Data Collector, when I attempt to access any Admin-account-creation screen or API endpoint, then access is denied (403) and no account is created.
- Given I am unauthenticated, when I attempt to call the create-admin API directly, then the request is rejected with 401 Unauthorized.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-AUTH-03-01 | Admin creates another Admin | Login as Admin → Manage Users → Add Administrator → fill form → Save | New ADMIN-role account created successfully. |
| TC-AUTH-03-02 | Data Collector blocked from creating Admin | Login as Data Collector → attempt to navigate to /admin/users/add-admin | 403 Forbidden / access-denied screen shown; no account created. |
| TC-AUTH-03-03 | Unauthenticated API call blocked | Call POST /api/users/admin without an auth token | 401 Unauthorized returned. |

---

## US-AUTH-04 — Administrators are prevented from submitting field survey forms

**Priority: Must Have** *SRS Reference: AUTH-04*

*As a **system**, I want **to block any account with role = ADMIN from submitting a PDM survey form**, so that **the distinction between data-collection and administrative roles is enforced, keeping the submission audit trail (collector identity) meaningful**.*

### Acceptance Criteria

- Given I am logged in as an Admin, when I look for the PDM survey entry point, then no form-submission UI is available to me (it is only shown to Data Collector accounts).
- Given an Admin session token, when a form-submission API call is made using that token, then the server rejects it (403) regardless of UI restrictions.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-AUTH-04-01 | Admin UI has no survey entry | Login as Admin, inspect navigation/menu | No 'New Survey' / PDM entry option is present. |
| TC-AUTH-04-02 | Server rejects Admin-submitted form | Using an Admin's valid access token, POST a BYP form submission payload directly to the API | Server responds 403 Forbidden; no submission record created. |

---

# EPIC 2 — PDM Survey Forms (Data Collector, Mobile PWA)

*Covers the four PDM respondent forms (BYP, IYP, LGO, Parish Chief) and the shared form behaviours (respondent selector, mandatory fields, conditional logic, age validation, multi-select, free-text validation, collector self-service submission count). Per SRS v1.1, these forms are visible and usable ONLY to authenticated Data Collectors — the public cannot access them.*

## US-FORM-01 — Data Collector selects a respondent category before starting a survey

**Priority: Must Have** *SRS Reference: FORM-01*

*As a **Data Collector**, I want **to choose the respondent category (Beneficiary Young Person, Individual Young Person, Local Government Official, or Parish Chief) from a drop-down on the PDM entry screen**, so that **I am shown the correct questionnaire for the person I am interviewing**.*

### Acceptance Criteria

- Given I am an authenticated Data Collector on the PDM entry screen, when the screen loads, then I see a drop-down listing exactly: Beneficiary Young Person (BYP), Individual Young Person (IYP), Local Government Official (LGO), Parish Chief (PC).
- Given I select a category, when the selection is made, then the corresponding form loads immediately for completion.
- Given I am not authenticated, when I try to reach the PDM entry screen, then I am redirected to the login screen and the category drop-down is not shown.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-01-01 | Category list is correct | Login as Data Collector → open PDM entry screen → open drop-down | Exactly 4 options shown: BYP, IYP, LGO, PC, in that order (no Duty Bearer option in Phase 1). |
| TC-FORM-01-02 | Selecting a category loads the right form | Select 'Individual Young Person' | IYP questionnaire (FORM-03) is displayed. |
| TC-FORM-01-03 | Unauthenticated access blocked | Log out, navigate directly to the PDM entry URL | Redirected to login; form selector not rendered. |

---

## US-FORM-02 — Data Collector completes the Beneficiary Young Person (BYP) form

**Priority: Must Have** *SRS Reference: FORM-02*

*As a **Data Collector**, I want **to capture a Beneficiary Young Person's demographics, fund-acquisition details, disbursement structure, service-quality ratings, governance/transparency, business development services received, and improvement suggestions**, so that **NAC has structured data on beneficiaries' experience receiving and using PDM funds**.*

**Notes:** *Fields per source form: Name, Age, Gender, District, City/Sub-county/Town Council, Contact; Q1 fund receipt duration (week/>1wk-<1mo/month/months-specify); Q2 received actual amount requested (Y/N); Q3 cash amount received (numeric/text); Q4 instalment period (Monthly/Quarterly/Biannually/Annual/Other-specify); Q5 PDC/Parish Chief service rating (5-point scale); Q6 PDM performance rating (5-point scale); Q7 group organized transparently (Y/N); Q8 business development services received (multi-select: training / market linkages / extension service); Q9 improvement suggestion (free text).*

### Acceptance Criteria

- Given I select BYP, when the form renders, then all fields listed in the Notes are present, labelled, and grouped in the same logical order as the source paper form.
- Given I select 'More than a week and less than a month' or 'Months' for Q1, when that option is chosen, then a free-text 'specify' field appears (conditional logic, see US-FORM-09).
- Given I select 'Others' for Q4 (instalment period), when that option is chosen, then a free-text 'specify' field appears.
- Given I select 'Yes' for Q8 (received business development services), when that option is chosen, then the multi-select list (training/market linkages/extension service) appears; if 'No' is selected, the multi-select is hidden and not required.
- Given all mandatory fields are completed validly, when I tap Submit, then the submission is stored locally (see SYNC epic) and I am returned to the PDM entry screen with a success confirmation.
- Given Age < 15 is entered, when I attempt to submit, then the form blocks submission per US-FORM-10.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-02-01 | Full valid submission | Select BYP → fill all fields with valid data → Submit | Submission saved locally with status PENDING (or SYNCED if online); confirmation shown. |
| TC-FORM-02-02 | Conditional 'specify' field for fund receipt duration | Select Q1 = 'Months (specify)' | A text input appears and is required before submission. |
| TC-FORM-02-03 | Conditional multi-select for business services | Select Q8 = 'Yes' | Checkboxes for Training/Market linkages/Extension service appear; selecting Q8 = 'No' hides them. |
| TC-FORM-02-04 | Missing mandatory field blocks submit | Leave 'Name of Respondent' blank → attempt Submit | Submission blocked; Name field flagged with an asterisk/error. |
| TC-FORM-02-05 | Rating fields restricted to defined scale | Inspect Q5/Q6 controls | Only Very Good / Good / Fair / Poor / Very Poor are selectable; no free text permitted. |

---

## US-FORM-03 — Data Collector completes the Individual Young Person (IYP) form

**Priority: Must Have** *SRS Reference: FORM-03*

*As a **Data Collector**, I want **to capture an Individual Young Person's demographics, PDM awareness, information sources, application status, access barriers, community perception, and improvement suggestions — regardless of whether they benefited from PDM**, so that **NAC understands programme awareness and access barriers across the broader youth population, not only beneficiaries**.*

**Notes:** *Key conditional paths from source form: Q3 (eligibility awareness) only shown 'If 1 = (a)' i.e. only if aware of PDM; Q6 (applied for fund) only shown 'If 1 = (a)'; Q7 (accessed fund after application) only shown 'If 6 = (a)'; Q8 (rejection narrative) only shown 'If 6 = (b)' AND application was made but not accessed; Q9 (reasons for not applying) only shown 'If 6 = (b)'.*

### Acceptance Criteria

- Given I select IYP, when the form renders, then all sections (demographics, awareness, application status, barriers, perception, feedback) are present in source-form order.
- Given Q1 (aware of PDM) = 'Unaware', when that answer is given, then Q3 (eligibility criteria awareness) is hidden and not required.
- Given Q6 (applied for the fund) = 'No', when that answer is given, then Q7 is hidden and Q9 (reasons for not applying) is shown instead.
- Given Q6 = 'Yes' and Q7 (accessed fund) = 'No', when both conditions are true, then Q8 (rejection narrative) is shown and required.
- Given Q10 (difficulties faced) includes 'Limitation in the amount applied for', when that checkbox is selected, then a free-text explanation field appears.
- Given all mandatory/conditionally-required fields are valid, when I tap Submit, then the submission is stored per the offline sync rules.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-03-01 | Unaware branch hides downstream questions | Select Q1 = 'Unaware' → observe form | Q3 (eligibility awareness) is not shown; form does not require it to submit. |
| TC-FORM-03-02 | Did-not-apply branch | Select Q6 = 'No' | Q7 and Q8 hidden; Q9 (reasons for not applying) shown and required. |
| TC-FORM-03-03 | Applied-but-rejected branch | Select Q6 = 'Yes', Q7 = 'No' | Q8 (narrate rejection) is shown and required before submit. |
| TC-FORM-03-04 | Multi-select barrier with free-text sub-field | Check 'Limitation in the amount applied for (low or high, explain)' | An explanation text box appears and must be filled before submit. |
| TC-FORM-03-05 | Full valid submission (aware, applied, accessed) | Q1=Aware, Q6=Yes, Q7=Yes, complete remaining fields → Submit | Submission accepted and stored; Q8/Q9 never required in this path. |

---

## US-FORM-04 — Data Collector completes the Local Government Official (LGO) form

**Priority: Must Have** *SRS Reference: FORM-04*

*As a **Data Collector**, I want **to capture administrative details, expected-vs-actual PDM funds received by FY, beneficiary statistics by FY, parish coverage by FY, funding equity/sufficiency assessments, and economic-impact feedback from a Local Government Official**, so that **NAC can track macro-level funding allocation, disbursement, and government perception of PDM effectiveness**.*

**Notes:** *Fields: District, City/Sub-county/Town Council, Name of Monitor, Date of Completion, Respondent Name/Title/Contact; Q1 Expected vs Actual funds for FY2022/23 and FY2023/24 (numeric); Q2 beneficiary counts (young people <30, young women <30, other) per FY; Q3 parish coverage (total parishes vs. parishes that received funds) per FY; Q4-Q7 Yes/No governance questions; Q8-Q9 Yes/No with conditional 'Explain' free-text field when answer is 'No'; Q10 improvement suggestion (free text).*

### Acceptance Criteria

- Given I select LGO, when the form renders, then Expected/Actual fund fields are shown separately for FY 2022/23 and FY 2023/24 as numeric inputs.
- Given Q8 (funds spent as required) = 'No', when that answer is chosen, then an 'Explain' free-text field appears and is required.
- Given Q9 (translating into economic transformation) = 'No', when that answer is chosen, then an 'Explain' free-text field appears and is required.
- Given a numeric field (e.g. Expected funds) is left blank or contains non-numeric characters, when I attempt to submit, then validation prevents submission with a clear inline error.
- Given all required fields are valid, when I tap Submit, then the submission is stored with financial_year_period context captured for reporting.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-04-01 | FY fields present for both years | Open LGO form, inspect Q1-Q3 | Separate Expected/Actual inputs exist for FY2022/23 and FY2023/24. |
| TC-FORM-04-02 | Conditional explain field on 'No' | Select Q8 = 'No' | 'Explain' text box appears and blocks submit if empty. |
| TC-FORM-04-03 | Numeric validation on fund fields | Enter 'abc' into Expected FY2022/23 field → attempt Submit | Submission blocked; numeric-format error shown. |
| TC-FORM-04-04 | Full valid submission | Fill all required fields with valid data (Q8/Q9 = 'Yes') → Submit | Submission accepted, no Explain fields required since answers are 'Yes'. |

---

## US-FORM-05 — Data Collector completes the Parish Level Monitoring (Parish Chief) form

**Priority: Must Have** *SRS Reference: FORM-05*

*As a **Data Collector**, I want **to capture parish financials, beneficiary breakdown, access barriers, PDC composition and training, monitoring & oversight tracking, and self-reliance/enterprise indicators for a parish**, so that **NAC can assess grassroots-level PDM governance and outcomes at the parish/ward level**.*

**Notes:** *Fields include: District, Parish/Ward, Monitor Name, Respondent Name/Title/Contact, Completion Date; Amount expected vs actual received by parish; beneficiary counts (total, young people <30, young women <30); obstacles (free text); spending targeted to most in need (Y/N); PDC composition counts; PDC training received (Y/N with conditional list of training areas if Yes); PDC effectiveness rating (Fully/Mostly/Some/Hardly/None); who monitored the programme (multi-select incl. CAO/RDC/City Clerk/SAS-Town Clerk/LCV Chairperson/LCIII-Mayor/Councillors/PDM Secretariat/Ministry of Local Government/Other-specify); monitoring method (free text); report shared with respondent (Y/N); improvements seen (Y/N, conditional 'what areas' free text if Yes); progress reports submitted (Y/N, conditional 'to whom and when' if Yes); self-reliance indicators (numeric counts).*

### Acceptance Criteria

- Given I select Parish Chief, when the form renders, then it is organised into the same sections as the source table: PDM Funds Receipt, Access to PDM Fund, PDC, Monitoring & Oversight, Self-reliance.
- Given PDC training received = 'Yes', when that is selected, then a repeatable/free-text list of training areas is shown and at least one entry is required.
- Given 'who monitored the programme' includes 'Others (specify)', when that checkbox is selected, then a free-text field appears and is required.
- Given 'did you see improvements' = 'Yes', when that is selected, then an 'in what areas' free-text field appears and is required.
- Given all required fields are valid, when I tap Submit, then the submission is stored with all section data intact and correctly associated to the parish/ward and financial year.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-05-01 | Section structure matches source form | Open Parish Chief form, scroll through all sections | Sections appear in order: Funds Receipt, Access to PDM Fund, PDC, Monitoring & Oversight, Self-reliance. |
| TC-FORM-05-02 | Conditional training-areas list | Select 'PDC received training' = Yes | Training-areas free-text list appears and requires ≥1 entry to submit. |
| TC-FORM-05-03 | Multi-select 'who monitored' with Other-specify | Check 'Others (specify)' under monitoring question | Free-text field appears and is required before submit. |
| TC-FORM-05-04 | Full valid submission | Complete all sections with valid data → Submit | Submission accepted and stored with correct parish/ward linkage. |

---

## US-FORM-06 — System auto-captures respondent identification and submission provenance on every form

**Priority: Must Have** *SRS Reference: FORM-06*

*As a **system**, I want **every survey submission (any of the 4 forms) to include Name, Phone Number, Gender, Age Group, District, Sub-county, Parish, and Village for the respondent, plus the authenticated Data Collector's identity (Collector ID + Name), submission timestamp, and device identifier — captured automatically, not entered manually for the collector fields**, so that **every record can be traced to who collected it, when, and from which device, and reporting can slice by demographic/location without extra data entry**.*

### Acceptance Criteria

- Given any of the 4 forms is submitted, when the record is saved, then it includes submitted_by (Collector ID), submitted_at (timestamp), and device_submission_id without the Data Collector having to type them.
- Given a form is being filled, when the respondent section is reached, then Name, Phone Number, Gender, Age Group, District, Sub-county, Parish, and Village fields are present and use the standard controls (cascading dropdowns for location, per US-FORM-07).
- Given the same device submits multiple forms in one session, when each is saved, then each submission has a distinct device_submission_id / timestamp so duplicates are distinguishable from genuinely new submissions.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-06-01 | Collector identity auto-captured | Login as Collector A → submit a BYP form → inspect stored record (via API/DB or Admin drill-down) | Record shows submitted_by = Collector A's ID/name, without any manual entry field in the UI for it. |
| TC-FORM-06-02 | Timestamp and device ID present | Submit a form and inspect the stored record | submitted_at and device_submission_id are populated and correspond to the actual submission time/device. |
| TC-FORM-06-03 | Respondent demographic fields present on all 4 forms | Open each of BYP/IYP/LGO/PC forms in turn | Each form includes Name, Phone, Gender, Age Group, and cascading District→Sub-county→Parish→Village fields. |

---

## US-FORM-07 — Location fields use cascading offline dropdowns instead of free text

**Priority: Must Have** *SRS Reference: FORM-07*

*As a **Data Collector**, I want **District, Sub-county, Parish, and Village to be selected via cascading drop-downs (each level filtered by the parent selection) that work fully offline**, so that **location data is clean and standardised for reporting, and I don't need connectivity to select a location while in the field**.*

### Acceptance Criteria

- Given the location section of any form, when I select a District, then the Sub-county dropdown populates with only sub-counties belonging to that district.
- Given a Sub-county is selected, when the Parish dropdown loads, then it lists only parishes belonging to that sub-county; the same cascading rule applies for Village under Parish.
- Given the device is offline, when I use the location dropdowns, then all four levels function correctly using the pre-bundled Uganda administrative dataset (no network call required).
- Given I change a higher-level selection (e.g. District) after choosing lower levels, when the change is made, then the dependent lower-level selections are cleared and must be re-selected.
- There is no free-text entry option for District/Sub-county/Parish/Village on any of the 4 forms.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-07-01 | Cascading population | Select District='Arua' → open Sub-county dropdown | Only Arua's sub-counties are listed. |
| TC-FORM-07-02 | Offline functionality | Enable Airplane Mode → open any form → use all 4 location dropdowns | All levels populate and cascade correctly with no network request. |
| TC-FORM-07-03 | Parent change clears children | Select District/Sub-county/Parish/Village fully, then change District | Sub-county, Parish, Village selections are reset to empty and must be reselected. |
| TC-FORM-07-04 | No free-text alternative | Inspect the location fields in the DOM/UI | Only select/dropdown controls exist; no text input accepts location values. |

---

## US-FORM-08 — Mandatory fields are visually marked and enforced before submission

**Priority: Must Have** *SRS Reference: FORM-08*

*As a **Data Collector**, I want **mandatory fields to be marked with an asterisk (*) and for the form to block submission until they are all completed**, so that **I know exactly what is required during the interview and can't accidentally submit incomplete data**.*

### Acceptance Criteria

- Given any of the 4 forms, when it renders, then every mandatory field's label is suffixed with a red asterisk (*).
- Given one or more mandatory fields are empty, when I tap Submit, then submission is blocked, the offending fields are highlighted, and the page scrolls/focuses to the first invalid field.
- Given all mandatory fields (including any conditionally-required fields currently visible) are completed, when I tap Submit, then the submission proceeds.
- Optional fields are not marked with an asterisk and do not block submission when left blank.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-08-01 | Asterisk marking present | Open BYP form | All mandatory fields show a visible '*' next to the label. |
| TC-FORM-08-02 | Submit blocked when incomplete | Leave one mandatory field blank → tap Submit | Submission blocked; field highlighted with error message; view scrolls to it. |
| TC-FORM-08-03 | Submit succeeds when complete | Complete all mandatory fields (including any triggered conditional ones) → tap Submit | Submission proceeds and is stored. |

---

## US-FORM-09 — Forms implement dynamic conditional show/hide logic

**Priority: Must Have** *SRS Reference: FORM-09*

*As a **Data Collector**, I want **questions that only apply based on a prior answer (e.g. rejection reason only if the application was rejected) to appear or disappear dynamically as I answer**, so that **I'm never shown irrelevant questions and the interview stays fast and focused**.*

**Notes:** *See per-form conditional rules documented in US-FORM-02 through US-FORM-05.*

### Acceptance Criteria

- Given a question has a defined trigger condition (e.g. 'If 6 = (b)'), when the triggering answer is NOT selected, then the dependent question is hidden and excluded from mandatory validation.
- Given the triggering answer IS selected, when that happens, then the dependent question becomes visible and, if marked mandatory, is enforced before submit.
- Given a triggering answer is changed after a dependent question was already answered, when the trigger no longer applies, then the dependent question is hidden AND its previously entered value is cleared (not silently submitted).
- All conditional relationships documented in the BYP, IYP, LGO, and Parish Chief forms are implemented exactly as specified (see form-specific stories).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-09-01 | Show on trigger | On IYP form, set Q6='No' | Q9 (reasons for not applying) becomes visible. |
| TC-FORM-09-02 | Hide when trigger not met | On IYP form, set Q6='Yes' | Q9 remains hidden and not required. |
| TC-FORM-09-03 | Value cleared when trigger reverses | Set Q6='No', fill Q9, then change Q6 back to 'Yes' | Q9 is hidden again and its previously entered value is discarded, not included in the final submission payload. |

---

## US-FORM-10 — Age field enforces a minimum of 15 years

**Priority: Must Have** *SRS Reference: FORM-10*

*As a **system**, I want **to reject any respondent Age value below 15 on all forms that capture Age**, so that **the survey data stays within the intended age policy and avoids invalid/child respondent records**.*

### Acceptance Criteria

- Given the Age field, when a value of 14 or below is entered, then an inline validation error is shown and the value is not accepted.
- Given the Age field, when a value of 15 or above is entered, then it is accepted.
- Given an invalid Age is present, when I attempt to Submit the form, then submission is blocked until Age is corrected to ≥15.
- Given Age Group (categorical) is used instead of exact age on a given form, when the lowest Age Group option is defined, then it excludes ranges below 15.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-10-01 | Reject under-15 age | Enter Age = 12 in BYP form → attempt to move on/submit | Validation error shown; value rejected. |
| TC-FORM-10-02 | Accept boundary value 15 | Enter Age = 15 | Accepted, no error. |
| TC-FORM-10-03 | Submit blocked while age invalid | Enter Age = 10, fill rest of form, tap Submit | Submission blocked; error remains on Age field until corrected. |

---

## US-FORM-11 — Forms support multi-select checkboxes where the source form allows multiple answers

**Priority: Must Have** *SRS Reference: FORM-11*

*As a **Data Collector**, I want **questions such as information channels or access barriers to let me select more than one option via checkboxes**, so that **I can accurately capture responses where the respondent gives more than one answer**.*

### Acceptance Criteria

- Given a multi-select question (e.g. IYP Q2 'How did you get information about PDM', or IYP Q10 'difficulties faced'), when I view it, then it is rendered as checkboxes (not radio buttons/single-select).
- Given I select multiple checkboxes, when I submit the form, then all selected options are stored (e.g. as a JSONB array) against the response.
- Given a multi-select question includes an 'Others (specify)' option, when that checkbox is checked, then a free-text field appears and is required.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-11-01 | Multiple checkboxes selectable | On IYP form Q2, check 'Radio' and 'Television' and 'Relatives/Friends' | All three remain checked simultaneously (not mutually exclusive). |
| TC-FORM-11-02 | Values persisted correctly | Submit the form with 3 checkboxes selected → inspect stored submission | information_channels field contains all 3 selected values as an array. |
| TC-FORM-11-03 | Other-specify sub-field | Check 'Others (specify)' | Free-text input appears and blocks submit if left empty. |

---

## US-FORM-12 — Free-text narrative fields enforce a minimum character count

**Priority: Should Have** *SRS Reference: FORM-12*

*As a **system**, I want **open-ended text questions (e.g. improvement suggestions, rejection narrative) to require at least 10 characters**, so that **low-quality, low-effort text responses (e.g. single letters) are reduced and qualitative data stays usable**.*

### Acceptance Criteria

- Given a free-text narrative field, when fewer than 10 characters are entered, then an inline error is shown ('Please provide at least 10 characters') and submission is blocked.
- Given 10 or more characters are entered, when I move to the next field or submit, then no length error is shown.
- This rule applies to all narrative fields across the 4 forms (e.g. 'What do you think should be improved...', rejection narrative, obstacles description).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-12-01 | Reject short text | Enter 'ok' (2 chars) into the improvement-suggestion field → attempt submit | Validation error shown; submission blocked. |
| TC-FORM-12-02 | Accept valid-length text | Enter a 12-character sentence into the same field | No error; field accepted. |
| TC-FORM-12-03 | Applies across forms | Repeat short-text test on the LGO 'Explain' field and Parish Chief 'obstacles' field | Same 10-character minimum enforced consistently. |

---

## US-FORM-13 — Data Collector views their own submission count without contacting Admin

**Priority: Must Have** *SRS Reference: FORM-13*

*As a **Data Collector**, I want **to see how many forms I have submitted for the current day/session directly in the app**, so that **I can track my own progress toward any quota without needing to ask an Admin**.*

### Acceptance Criteria

- Given I am logged in, when I view my home/dashboard screen, then I see a count of submissions made today (and ideally this session), broken down or totalled across all 4 form types.
- Given I submit a new form (online or offline/queued), when the submission completes, then my displayed count increments immediately, even before the item has synced to the server.
- Given a new day starts (local device date changes), when I open the app, then the 'today' counter resets to reflect only the new day's submissions, while historical totals remain accessible if provided.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-FORM-13-01 | Counter reflects submissions | Submit 3 forms in a session → check counter | Counter shows 3. |
| TC-FORM-13-02 | Counter increments while offline | Go offline, submit 2 forms (queued, not yet synced) → check counter | Counter includes the 2 queued submissions immediately. |
| TC-FORM-13-03 | Daily reset | Submit forms on Day 1, change device date to Day 2, reopen app | Today's counter shows 0 for Day 2; Day 1 submissions are not counted as 'today'. |

---

# EPIC 3 — Respondent Uniqueness & Data Integrity

*New in SRS v1.1: data collection runs twice per financial year (Jan–Jun / Jul–Dec). A respondent's phone number can only be associated with a given form type once per financial-year period, enforced both client-side (before sync) and server-side (on sync).*

## US-UNIQ-01 — Client blocks a duplicate respondent+form-type submission within the same FY period

**Priority: Must Have** *SRS Reference: UNIQ-01 / UNIQ-02*

*As a **Data Collector**, I want **the app to check, at the point of filling in the respondent's phone number, whether that number has already been used for this form type in the current financial-year period (Jan 1–Jun 30 or Jul 1–Dec 31), and to block submission with a clear message if so**, so that **I don't accidentally record the same respondent twice for the same survey in the same period, and data quality is protected even before the record reaches the server**.*

### Acceptance Criteria

- Given I enter a respondent phone number that already exists locally (cached) for the same form type and current FY period, when I attempt to Submit, then the system blocks submission and shows a message naming the form type and FY period already recorded for that number.
- Given the phone number has NOT been used for this form type in the current FY period, when I Submit, then the submission proceeds normally.
- Given the same phone number was used for a DIFFERENT form type (e.g. BYP already submitted, now doing IYP) in the same period, when I Submit the IYP form, then it is allowed — the uniqueness constraint is per form type, not global.
- Given the same phone number was used for the SAME form type but in a DIFFERENT FY period (e.g. Jan–Jun vs Jul–Dec), when I Submit, then it is allowed.
- The financial year period boundaries used for this check are Jan 1–Jun 30 and Jul 1–Dec 31, derived from the device's current date at time of entry.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-UNIQ-01-01 | Block same phone + same form + same period | Submit BYP form for phone 0700111222 in March 2026 → attempt to submit another BYP form for the same phone number in May 2026 (same Jan–Jun period) | Second submission blocked with a message identifying 'BYP form already submitted for this respondent in Jan–Jun 2026'. |
| TC-UNIQ-01-02 | Allow different form type, same phone, same period | After BYP submitted for 0700111222 in March 2026, submit an IYP form for the same number in April 2026 | IYP submission is accepted. |
| TC-UNIQ-01-03 | Allow same form type, different FY period | BYP submitted for 0700111222 in March 2026 (Jan–Jun); attempt another BYP submission for the same number in August 2026 (Jul–Dec) | Submission is accepted. |
| TC-UNIQ-01-04 | Error message clarity | Trigger a blocked duplicate as in TC-UNIQ-01-01 | Message explicitly names the form type and the FY period already on record, not a generic error. |

---

## US-UNIQ-02 — Server re-validates respondent uniqueness at sync time

**Priority: Must Have** *SRS Reference: UNIQ-03*

*As a **system**, I want **every incoming submission to be re-checked server-side for the same phone+form-type+FY-period uniqueness rule at the moment it syncs**, so that **duplicates arising from multiple offline devices recording the same respondent (which the client alone cannot detect) are still caught**.*

### Acceptance Criteria

- Given two different devices independently submit a BYP form for the same respondent phone number within the same FY period while both offline, when both submissions sync to the server, then the server accepts the first-arriving submission normally and flags the second as status = FLAGGED (or DUPLICATE) rather than silently accepting or rejecting it outright.
- Given a submission is flagged as a duplicate on sync, when an Admin views the Admin Dashboard, then the flagged submission is visible for manual review (see US-DASH epic) rather than being hidden.
- Given a submission passes the server-side uniqueness check, when it syncs, then its status is set to SYNCED and it is included in all reporting.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-UNIQ-02-01 | Two offline devices, same respondent | Device A and Device B (both offline) each submit a BYP form for phone 0700333444 in the same FY period; bring both online to sync | First-arriving submission syncs as SYNCED; second is marked FLAGGED/DUPLICATE, not silently accepted or dropped. |
| TC-UNIQ-02-02 | Flagged submission visible to Admin | After TC-UNIQ-02-01, login as Admin and view submissions | The flagged/duplicate submission appears with a distinct status indicator for review. |
| TC-UNIQ-02-03 | Non-duplicate syncs normally | A single, unique submission syncs to the server | Status becomes SYNCED; appears in all dashboards/reports. |

---

# EPIC 4 — Offline-First Data Sync

*Ensures Data Collectors can complete and submit forms with zero connectivity, with reliable background synchronization once a connection becomes available.*

## US-SYNC-01 — Every submission is stored locally immediately, regardless of connectivity

**Priority: Must Have** *SRS Reference: SYNC-01*

*As a **Data Collector**, I want **my form submission to be saved to the device (IndexedDB) the instant I tap Submit, whether or not I have connectivity**, so that **I never lose an interview's data because of a network outage**.*

### Acceptance Criteria

- Given I am offline, when I tap Submit on any of the 4 forms, then the submission is written to IndexedDB immediately and I see a confirmation that it has been saved locally and is pending sync.
- Given I am online, when I tap Submit, then the submission is still written to IndexedDB first (as the source of truth) before/while any sync attempt happens.
- Given the app is closed or the device restarts after a local save but before sync, when the app is reopened, then the queued submission is still present and will be retried.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-SYNC-01-01 | Offline save | Enable Airplane Mode → submit a BYP form | Submission written to IndexedDB; UI confirms 'Saved locally, pending sync'. |
| TC-SYNC-01-02 | Survives app restart | Submit offline, force-close the app, reopen it | The queued submission is still listed as pending; not lost. |
| TC-SYNC-01-03 | Online save still local-first | While online, submit a form and immediately kill network before sync completes | Local record persists in IndexedDB regardless of sync outcome. |

---

## US-SYNC-02 — Background sync worker automatically pushes queued submissions when connectivity returns

**Priority: Must Have** *SRS Reference: SYNC-02*

*As a **Data Collector**, I want **queued submissions to sync to the server automatically in the background as soon as the device regains connectivity, without me having to manually trigger anything**, so that **I can keep working in the field and trust that data reaches NAC's server whenever a signal appears**.*

### Acceptance Criteria

- Given queued submissions exist and the device was offline, when connectivity is restored, then a background sync worker detects this and begins pushing queued submissions without user action.
- Given multiple submissions are queued, when sync runs, then they are sent in a sensible order (e.g. oldest first) and each is marked SYNCED individually as it succeeds.
- Given the app is in the background or closed (but the OS allows background sync via Service Worker), when connectivity returns, then sync still proceeds without requiring the app to be in the foreground, subject to platform/browser limitations.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-SYNC-02-01 | Auto-sync on reconnect | Queue 2 submissions offline → disable Airplane Mode | Within a reasonable interval, both submissions sync automatically without user interaction; status changes to SYNCED. |
| TC-SYNC-02-02 | Order of sync | Queue submissions A then B while offline → reconnect | A is sent/synced before B (oldest-first), verifiable via timestamps/logs. |
| TC-SYNC-02-03 | Background sync while app closed | Queue a submission, close the app fully, then restore connectivity | Submission syncs once connectivity is available, confirmed on next app open (status SYNCED). |

---

## US-SYNC-03 — Visible sync status indicator

**Priority: Must Have** *SRS Reference: SYNC-03*

*As a **Data Collector**, I want **a persistent, visible indicator showing whether I'm connected/offline, how many submissions are pending sync, and when the last successful sync happened**, so that **I always know the state of my data without guessing**.*

### Acceptance Criteria

- Given I am using the app, when I look at the status indicator (e.g. header/banner), then it shows Online or Offline accurately reflecting device connectivity.
- Given I have pending submissions, when I view the indicator, then it shows the exact count of submissions still pending sync.
- Given a successful sync has occurred, when I view the indicator, then it displays the timestamp of the last successful sync.
- Given connectivity changes (online↔offline), when the change occurs, then the indicator updates within a few seconds without requiring a manual refresh.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-SYNC-03-01 | Online/offline reflected accurately | Toggle Airplane Mode on and off | Indicator switches between Offline and Online within seconds each time. |
| TC-SYNC-03-02 | Pending count accurate | Queue 4 submissions offline | Indicator shows 'Pending: 4'. |
| TC-SYNC-03-03 | Last sync time shown | Allow a sync to complete successfully | Indicator updates to show 'Last synced: <timestamp>' matching actual sync time. |

---

## US-SYNC-04 — Failed syncs retry with exponential back-off and notify the Data Collector

**Priority: Must Have** *SRS Reference: SYNC-04*

*As a **Data Collector**, I want **submissions that fail to sync (e.g. due to a server error) to remain queued and retry automatically with increasing wait times between attempts, and to be told when a sync fails**, so that **transient server issues don't cause data loss and I'm kept informed rather than left wondering**.*

### Acceptance Criteria

- Given a sync attempt fails due to a server error, when the failure occurs, then the submission remains in the pending queue (not discarded) and is not marked SYNCED.
- Given a sync failure, when the next retry is scheduled, then the wait interval increases with each consecutive failure (exponential back-off) up to a sensible maximum.
- Given a sync ultimately fails, when this happens, then the Data Collector receives an in-app notification/indicator that a sync attempt failed and the item is still pending.
- Given connectivity/server issues resolve, when the next retry occurs, then the submission syncs successfully and the pending count decreases.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-SYNC-04-01 | Failure keeps item queued | Simulate a server 500 error during sync of a queued submission | Submission remains status PENDING; not lost or marked SYNCED. |
| TC-SYNC-04-02 | Back-off timing increases | Force repeated sync failures and log retry timestamps | Interval between retries increases each time (e.g. 5s, 10s, 20s...) up to a cap. |
| TC-SYNC-04-03 | User notified of failure | Force one sync failure | An in-app alert/banner informs the Data Collector that sync failed and will retry. |
| TC-SYNC-04-04 | Recovery after failure | Restore server availability after failures | Submission syncs successfully on the next retry; status becomes SYNCED. |

---

## US-SYNC-05 — Uganda administrative location data is bundled offline and updates in the background

**Priority: Must Have** *SRS Reference: SYNC-05*

*As a **Data Collector**, I want **the full District/Sub-county/Parish/Village dataset to be available on my device even before I ever get a connection, and to refresh automatically when I do have connectivity**, so that **the cascading location selectors (US-FORM-07) always work in the field**.*

### Acceptance Criteria

- Given a fresh PWA install, when installation completes (even over a minimal connection), then the full Uganda administrative location dataset is bundled/cached on the device.
- Given the device later connects to the internet, when a background check runs, then any updates to the location dataset are fetched and cached without interrupting the Data Collector's current work.
- Given the device is offline, when location dropdowns are used, then they function fully from the cached dataset with no degraded experience.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-SYNC-05-01 | Dataset present after install | Install the PWA, then immediately go offline and open a form | All 4 location levels populate correctly with no network calls. |
| TC-SYNC-05-02 | Background update | Simulate an updated location dataset on the server, bring the device online | Updated dataset is fetched and cached in the background without blocking form use. |
| TC-SYNC-05-03 | No degradation offline | Use location dropdowns for all 4 forms while fully offline | Behaviour and completeness match the online experience. |

---

# EPIC 5 — Admin Dashboard

*The authenticated Admin-only dashboard for monitoring data collection, managing users, and exporting/reporting on survey data.*

## US-DASH-01 — Admin views aggregated PDM data as charts

**Priority: Must Have** *SRS Reference: DASH-01*

*As a **Administrator**, I want **to see aggregated data rendered as bar charts, pie charts, and line graphs over time — not just raw tables**, so that **I can quickly understand trends and patterns in the data rather than manually parsing tables**.*

### Acceptance Criteria

- Given I am on the Admin Dashboard, when the page loads, then at minimum a bar chart (e.g. submissions by district), a pie chart (e.g. gender split), and a line graph (e.g. submissions over time) are displayed.
- Given the underlying data changes (e.g. a new submission syncs), when I refresh or the dashboard auto-updates, then the charts reflect the current data.
- Given a dataset of up to 50,000 submissions, when charts render, then they complete rendering within 4 seconds (NFR 5.1).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-01-01 | Charts render on load | Login as Admin → open Dashboard | Bar, pie, and line charts are visible and populated with data. |
| TC-DASH-01-02 | Charts reflect new data | Sync a new submission → refresh dashboard | Chart totals/values update to include the new submission. |
| TC-DASH-01-03 | Performance at scale | Load the dashboard against a seeded dataset of 50,000 submissions, measure render time | All charts fully rendered within 4 seconds. |

---

## US-DASH-02 — Admin filters dashboard data by multiple dimensions

**Priority: Must Have** *SRS Reference: DASH-02*

*As a **Administrator**, I want **to filter the dashboard by District, Sub-county, Parish, Form Type, Date Range, Gender, Age Group, Data Collector, and Financial Year Period**, so that **I can drill into exactly the slice of data I need (e.g. a donor asking about one district)**.*

### Acceptance Criteria

- Given the dashboard, when I open the filter panel, then all 9 filter dimensions listed above are available.
- Given I apply one or more filters, when the filter is applied, then all charts and summary statistics on the page update to reflect only the filtered data.
- Given multiple filters are combined (e.g. District=Arua AND Form Type=BYP AND FY=Jan–Jun 2026), when applied together, then results reflect the intersection (AND logic) of all active filters.
- Given I clear all filters, when cleared, then the dashboard returns to showing the full unfiltered dataset.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-02-01 | All filter dimensions present | Open filter panel | District, Sub-county, Parish, Form Type, Date Range, Gender, Age Group, Data Collector, FY Period all present. |
| TC-DASH-02-02 | Single filter updates charts | Filter by District='Mayuge' | All charts/stats update to reflect only Mayuge data. |
| TC-DASH-02-03 | Combined filters use AND logic | Filter District='Arua' + Form Type='BYP' | Only BYP submissions from Arua are shown, not the union of both. |
| TC-DASH-02-04 | Clear filters | Apply filters, then click 'Clear all' | Dashboard reverts to unfiltered full dataset. |

---

## US-DASH-03 — Admin sees prominent summary statistics

**Priority: Must Have** *SRS Reference: DASH-03*

*As a **Administrator**, I want **key summary numbers — total submissions, submissions by form type, breakdown by district, gender split, time-series trend, and submissions by financial year period — displayed prominently**, so that **I get an at-a-glance snapshot of programme monitoring progress without digging into charts**.*

### Acceptance Criteria

- Given the dashboard loads, when I view the top of the page, then summary stat cards for total submissions, by form type, by district, gender split, and by FY period are visible without scrolling on a standard desktop viewport.
- Given filters are applied, when summary stats are shown, then they recalculate to reflect the filtered subset (consistent with US-DASH-02).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-03-01 | Summary cards visible | Load dashboard on a 1440px-wide viewport | All listed summary stats visible above the fold. |
| TC-DASH-03-02 | Stats respect filters | Apply a District filter | Total submissions and other summary numbers update to the filtered count. |

---

## US-DASH-04 — Admin drills down from aggregate charts to individual submissions

**Priority: Must Have** *SRS Reference: DASH-04*

*As a **Administrator**, I want **to click into a chart segment or summary stat and see the underlying individual submission records**, so that **I can investigate specific data points, verify data quality, or follow up on a flagged issue**.*

### Acceptance Criteria

- Given a chart (e.g. bar chart segment for District='Nakawa'), when I click/tap that segment, then I am shown a list of the individual submissions contributing to it.
- Given the drill-down list, when I select an individual submission, then I can view its full detail (all captured field values, respondent info, collector, timestamp, sync status).
- Given I am in a drilled-down view, when I want to return, then I can navigate back to the aggregate dashboard view without losing my previously applied filters.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-04-01 | Drill-down from chart | Click the 'Nakawa' bar in the district chart | List of individual submissions from Nakawa is displayed. |
| TC-DASH-04-02 | Full submission detail view | Click one submission from the drill-down list | Full form-field detail for that submission is shown, including collector and timestamp. |
| TC-DASH-04-03 | Filters preserved on return | Apply a filter, drill down, then navigate back | Original filter selections are still applied on the aggregate view. |

---

## US-DASH-05 — Admin exports data as CSV/Excel and generates printable PDF reports

**Priority: Must Have** *SRS Reference: DASH-05*

*As a **Administrator**, I want **to export the current filtered (or full) dataset as CSV or Excel, and generate shareable/printable PDF reports**, so that **I can provide donors and government stakeholders with real data files rather than screenshots**.*

### Acceptance Criteria

- Given a filtered or unfiltered dataset on the dashboard, when I click 'Export CSV', then a CSV file downloads containing exactly the currently filtered rows and all relevant columns.
- Given the same context, when I click 'Export Excel', then an .xlsx file downloads with equivalent data, correctly typed columns, and a header row.
- Given I click 'Generate PDF Report', when generation completes, then a PDF is produced containing summary statistics/charts suitable for printing or sharing with stakeholders.
- Given a very large dataset (up to 50,000 records), when exporting, then the export completes successfully without timing out or truncating data.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-05-01 | CSV export matches filter | Apply District filter, click Export CSV, open file | CSV rows only include the filtered district's submissions; all expected columns present. |
| TC-DASH-05-02 | Excel export format | Click Export Excel, open in a spreadsheet app | Valid .xlsx opens with header row and correctly typed columns (numbers as numbers, dates as dates). |
| TC-DASH-05-03 | PDF report generation | Click Generate PDF Report | A PDF downloads containing summary stats/charts, formatted for printing. |
| TC-DASH-05-04 | Large dataset export | Export a full dataset of 50,000 records | Export completes successfully with all records included, no timeout/truncation. |

---

## US-DASH-06 — Admin manages user accounts and sees each collector's respondents

**Priority: Must Have** *SRS Reference: DASH-06*

*As a **Administrator**, I want **to create, deactivate, and reset passwords for user accounts, assign roles, and see the list of respondents each Data Collector has worked with**, so that **I have full lifecycle control over who can use the system and can trace collector activity**.*

### Acceptance Criteria

- Given the Users management screen, when I select a Data Collector, then I can deactivate their account (they can no longer log in), reactivate it, or reset their password.
- Given I deactivate a Data Collector, when they attempt to log in (online or offline), then access is denied.
- Given I select a Data Collector, when I view their profile, then I see a list of the respondents/submissions they have recorded, with the ability to filter by form type, district, date, and FY period.
- Given I reset a password, when the reset completes, then a new password is generated/set and can be communicated to the collector out-of-band; their old password no longer works.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-06-01 | Deactivate account blocks login | Deactivate a Data Collector's account → attempt login as that collector | Login denied with an appropriate message. |
| TC-DASH-06-02 | Password reset invalidates old password | Reset a collector's password → attempt login with the old password | Old password rejected; new password works. |
| TC-DASH-06-03 | View collector's respondents | Open a Data Collector's profile | List of their submissions/respondents is shown, filterable by form type/district/date/FY. |

---

## US-DASH-07 — Admin views the Data Collector Tracker (leaderboard)

**Priority: Must Have** *SRS Reference: DASH-07*

*As a **Administrator**, I want **a leaderboard/list of all Data Collectors paired with their total cumulative form submissions, filterable by collector, form type, district, date range, and financial year period**, so that **I can track field-team performance and quota progress, and see who collected what and when**.*

### Acceptance Criteria

- Given the Data Collector Tracker screen, when it loads, then it lists every Data Collector with their cumulative submission count, sorted descending by default.
- Given the tracker's filters, when I filter by collector, form type, district, date range, or FY period, then the leaderboard numbers recalculate to reflect only matching submissions.
- Given I select an individual collector row, when selected, then I can see a further breakdown of that collector's submissions by form type and district.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-07-01 | Leaderboard populated and sorted | Open Data Collector Tracker | All collectors listed with correct cumulative counts, sorted highest to lowest by default. |
| TC-DASH-07-02 | Filter by FY period | Filter tracker to FY Jul–Dec 2025 only | Counts reflect only submissions within that period. |
| TC-DASH-07-03 | Drill into one collector | Click a collector's row | Breakdown by form type and district for that collector is shown. |

---

## US-DASH-08 — Admin sees the pending-sync queue across all field devices

**Priority: Should Have** *SRS Reference: DASH-08*

*As a **Administrator**, I want **visibility into how many submissions have been received vs. are still pending from field devices**, so that **I can spot connectivity problems or a stuck device and follow up with the relevant Data Collector**.*

### Acceptance Criteria

- Given the pending-sync queue view, when it loads, then it shows counts of SYNCED vs PENDING (and FLAGGED/DUPLICATE) submissions, ideally broken down by Data Collector.
- Given a Data Collector has submissions stuck in PENDING for an unusually long time, when I view the queue, then that collector/device is visibly distinguishable (e.g. flagged or sorted to the top).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-08-01 | Queue counts accurate | With a mix of synced and queued submissions in the system, open the pending-sync queue view | Counts match actual SYNCED/PENDING/FLAGGED totals. |
| TC-DASH-08-02 | Stale pending items surfaced | Simulate a submission pending for >48 hours | That item/collector is visibly flagged in the queue view. |

---

## US-DASH-09 — Admin (and public) can read PDM information/resources without logging in

**Priority: Should Have** *SRS Reference: DASH-09*

*As a **member of the public / Administrator**, I want **a content section describing the PDM programme, budget allocations, and priorities, accessible without authentication**, so that **stakeholders can understand the programme context alongside the data, addressing a gap noted from the previous app**.*

### Acceptance Criteria

- Given the platform's public area, when I navigate to 'PDM Information' / 'Resources', then I can read programme background, budget allocation info, and priorities without logging in.
- Given I am an Admin, when I need to update this content, then I have an interface to edit/publish it without a code deployment.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-DASH-09-01 | Public access to resources | As an unauthenticated visitor, navigate to the PDM Information section | Content loads without requiring login. |
| TC-DASH-09-02 | Admin can edit content | Login as Admin, edit the PDM Information content, publish | Updated content appears on the public page without a code deploy. |

---

# EPIC 6 — Public Dashboard

*A no-login, highly interactive dashboard for donors, government officials, researchers, and the general public to explore and download aggregated PDM data. Per SRS v1.1, this must be modern, elaborate, and support raw-data download by anyone.*

## US-PUB-01 — Anyone can view the public dashboard without logging in, with PII excluded

**Priority: Must Have** *SRS Reference: PUB-01 / PUB-02*

*As a **member of the public / donor / researcher**, I want **to access the public dashboard without any authentication and see only aggregated, anonymised PDM statistics**, so that **I can review programme performance transparently without needing an account, while respondents' and collectors' personal data stays protected**.*

### Acceptance Criteria

- Given I am an unauthenticated visitor, when I navigate to the public dashboard URL, then it loads fully with no login prompt.
- Given any data displayed or exported from the public dashboard, when I inspect it, then it never contains respondent name, phone number, or Data Collector personal information — only aggregated/anonymised figures.
- Given the underlying API endpoints powering the public dashboard, when called directly, then they never return PII fields regardless of query parameters used.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-PUB-01-01 | No login required | Open the public dashboard URL in a private/incognito browser with no session | Dashboard loads fully; no redirect to login. |
| TC-PUB-01-02 | No PII in displayed data | Browse all public dashboard views and drill-downs | No respondent names, phone numbers, or collector names are visible anywhere. |
| TC-PUB-01-03 | No PII in public API responses | Call the public dashboard's backend API directly with varying query params | Response payloads never include PII fields. |

---

## US-PUB-02 — Visitor applies interactive filters that update the dashboard in real time

**Priority: Must Have** *SRS Reference: PUB-03*

*As a **member of the public / researcher**, I want **to filter the public dashboard by District, Sub-county, Parish, Age Group, Gender, Form Type, Financial Year Period, Date Range, and Programme Area**, so that **I can explore exactly the data slice relevant to my research or reporting needs**.*

### Acceptance Criteria

- Given the public dashboard, when I open the filter controls, then all 8 listed filter dimensions are available.
- Given I change a filter value, when the change is applied, then all charts and statistics on the page update in real time (no full page reload required) within a few seconds.
- Given I combine multiple filters, when applied together, then the result reflects the intersection of all active filters, consistent with the Admin Dashboard's filtering behaviour.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-PUB-02-01 | All filters present | Open the public dashboard's filter panel | District, Sub-county, Parish, Age Group, Gender, Form Type, FY Period, Date Range, Programme Area all present. |
| TC-PUB-02-02 | Real-time update | Change District filter | Charts/stats update within a few seconds without a full page reload. |
| TC-PUB-02-03 | Combined filters | Filter by Gender='Female' + Form Type='IYP' | Only IYP submissions from female respondents are reflected. |

---

## US-PUB-03 — Visitor views rich visualisations of PDM data

**Priority: Must Have** *SRS Reference: PUB-04*

*As a **member of the public / donor**, I want **to see bar charts (submissions by district), pie charts (gender split, age group distribution), line graphs (submission trends over time), heat maps (geographic distribution), and summary stat cards**, so that **I can visually understand programme reach and trends without needing to analyse raw data myself**.*

### Acceptance Criteria

- Given the public dashboard, when it loads, then bar charts, pie charts, line graphs, a geographic heat map, and summary stat cards are all present and populated.
- Given active filters, when applied, then all these visualisations update consistently with the filtered dataset.
- Given the heat map, when I hover/tap a district/parish region, then a tooltip shows the relevant submission count or metric for that region.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-PUB-03-01 | All visualisation types present | Load public dashboard | Bar chart, pie chart(s), line graph, heat map, and stat cards are all rendered. |
| TC-PUB-03-02 | Visualisations respect filters | Apply a Parish filter | All chart types update to reflect only that parish's data. |
| TC-PUB-03-03 | Heat map tooltip | Hover over a district on the heat map | Tooltip shows that district's submission count/metric. |

---

## US-PUB-04 — Any visitor downloads raw (aggregated/anonymised) data as CSV or Excel without login

**Priority: Must Have** *SRS Reference: PUB-05*

*As a **data analyst / researcher / donor**, I want **to download the currently filtered or full PDM dataset as CSV or Excel directly from the public dashboard, with no authentication**, so that **I can perform my own independent analysis outside the platform**.*

### Acceptance Criteria

- Given the public dashboard with any combination of filters applied, when I click 'Download CSV' (or Excel), then a file downloads containing the filtered dataset in aggregated/anonymised form — no PII fields.
- Given no filters are applied, when I click download, then the full anonymised dataset downloads.
- Given this action is performed by an unauthenticated visitor, when the download completes, then no login prompt or account creation was required at any point.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-PUB-04-01 | Filtered download | Apply District filter, click Download CSV | CSV contains only that district's aggregated/anonymised data. |
| TC-PUB-04-02 | Full download with no filters | Clear all filters, click Download Excel | Full anonymised dataset downloads as .xlsx. |
| TC-PUB-04-03 | No auth required | Perform the download flow in an incognito/unauthenticated session | No login prompt appears at any step; download completes. |
| TC-PUB-04-04 | No PII in downloaded file | Inspect the downloaded CSV/Excel columns | No respondent name/phone or collector PII columns present. |

---

## US-PUB-05 — Visitor shares a specific filtered dashboard view via URL

**Priority: Must Have** *SRS Reference: PUB-06*

*As a **government official / event presenter**, I want **the dashboard's current filter selections to be reflected in the browser URL, so I can copy and share a link to a specific filtered view**, so that **I can present or share a precise slice of data (e.g. one district's stats) at an event without walking the recipient through re-applying filters**.*

### Acceptance Criteria

- Given I apply filters on the public dashboard, when the filters change, then the URL updates (e.g. via query parameters) to encode the current filter state.
- Given I copy the current URL and open it in a new browser/session, when the page loads, then the same filters are automatically applied and the same view is reproduced.
- Given I share this URL with someone else, when they open it, then they see the exact filtered view without needing to log in or manually reconstruct the filters.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-PUB-05-01 | URL reflects filters | Apply District='Yombe' and Gender='Male' filters | URL query parameters update to encode both filters. |
| TC-PUB-05-02 | URL reproduces the view | Copy the filtered URL, open in a new incognito window | Dashboard loads with District='Yombe' and Gender='Male' filters pre-applied. |
| TC-PUB-05-03 | Shared link works for others | Send the URL to a second device/browser, open it | Identical filtered view renders without login. |

---

## US-PUB-06 — Public dashboard has a modern, elaborate, presentation-quality design

**Priority: Must Have** *SRS Reference: PUB-07*

*As a **donor / government partner**, I want **the public dashboard to look modern, visually compelling, and intuitive**, so that **it reflects well on NAC and the quality of data collected when presented to donors, government, and international partners**.*

**Notes:** *This is a design/UX acceptance criterion validated primarily through design review and stakeholder sign-off rather than automated tests; the frontend-design skill/guidance should inform implementation.*

### Acceptance Criteria

- Given a design review with NAC/Tricia, when the public dashboard is demonstrated, then it is confirmed as visually modern and elaborate (not a bare default-styled table/chart page).
- Given the dashboard is viewed on both desktop and mobile, when accessed, then the layout adapts responsively and remains visually polished on each.
- Given accessibility basics, when reviewed, then text contrast, font sizing, and interactive element sizing meet reasonable usability standards even though this audience is not the low-literacy field audience.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-PUB-06-01 | Stakeholder design sign-off | Present the public dashboard to NAC stakeholders for review | Explicit sign-off that the design meets the 'modern, elaborate, intuitive' bar. |
| TC-PUB-06-02 | Responsive on desktop and mobile | Load the dashboard at 1440px and at 375px viewport widths | Layout adapts appropriately at both sizes with no broken/overlapping elements. |
| TC-PUB-06-03 | Basic accessibility | Run an automated accessibility audit (e.g. Lighthouse/axe) against the public dashboard | No critical contrast or tap-target-size violations reported. |

---

# EPIC 7 — Budget Priorities Module (Phase 2 — Backlog, not MVP)

*Documented here for backlog/planning purposes only, per SRS v1.1 §4.7. NOT part of Phase 1 MVP delivery.*

## US-BP-01 — Member of the public submits a sectoral Budget Priorities form, once per section per FY period

**Priority: Phase 2** *SRS Reference: BP-01 / BP-02 / BP-03*

*As a **member of the public**, I want **to fill in one of four sectoral Budget Priorities forms (Health, Agriculture, Education, Climate) after verifying my phone number, and be limited to one submission per section per financial-year period**, so that **I can voice my budget priorities directly to government without needing a Data Collector, while the system prevents ballot-stuffing/duplicate submissions**.*

### Acceptance Criteria

- Given I am a public visitor, when I choose to fill a Budget Priorities section, then I am first asked to enter and verify my phone number before the form is shown.
- Given my phone number has already been used for this specific section in the current FY period, when I attempt to start the form, then I am blocked with a clear explanation.
- Given my phone number has NOT been used for this section in the current FY period, when I proceed, then I can complete and submit the form.
- Given I have already submitted the Health section this FY period, when I attempt the Agriculture section with the same phone number, then it is allowed (uniqueness is per-section, not global).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-BP-01-01 | Phone verification gate | Attempt to open the Health Budget Priorities form | Phone number entry/verification step precedes the actual form. |
| TC-BP-01-02 | Block duplicate per section per FY | Submit Health section with phone X in Q1 FY2026, attempt Health section again with phone X in Q2 same FY period | Second attempt blocked with a clear message. |
| TC-BP-01-03 | Allow different section, same phone, same period | Submit Health with phone X, then attempt Agriculture with phone X in the same period | Agriculture submission allowed. |

---

## US-BP-02 — Budget Priorities data appears on the public dashboard and is downloadable

**Priority: Phase 2** *SRS Reference: BP-04*

*As a **member of the public / researcher**, I want **Budget Priorities data to be visualised on the public dashboard and downloadable as CSV/Excel alongside PDM data**, so that **I can analyse public budget-priority sentiment the same way I analyse PDM monitoring data**.*

### Acceptance Criteria

- Given Budget Priorities submissions exist, when I view the public dashboard, then a dedicated view/section displays aggregated Budget Priorities data (by sector).
- Given that view, when I click download, then the aggregated/anonymised Budget Priorities dataset downloads as CSV or Excel.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-BP-02-01 | Dashboard section exists | Open public dashboard, navigate to Budget Priorities view | Aggregated data by sector is displayed. |
| TC-BP-02-02 | Downloadable data | Click download on the Budget Priorities view | CSV/Excel file downloads with anonymised data. |

---

# EPIC 8 — LGO Budget Allocation Form (Phase 2 — Backlog, not MVP)

*Documented here for backlog/planning purposes only, per SRS v1.1 §4.8. NOT part of Phase 1 MVP delivery.*

## US-LGOB-01 — Data Collector completes the LGO Budget Allocation form on behalf of an LGO

**Priority: Phase 2** *SRS Reference: LGO-01 / LGO-02*

*As a **Data Collector**, I want **to interview a Local Government Official and record how the previous FY's budget was allocated across sectors, their rationale, and recommendations for the coming FY**, so that **NAC can compare budget allocation rationale and recommendations across Local Governments**.*

### Acceptance Criteria

- Given this form, when accessed, then it is only reachable by an authenticated Data Collector (LGOs cannot self-submit).
- Given the form, when completed, then it captures prior-FY sectoral allocations, rationale (free text), and recommendations for the coming FY (free text).

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-LGOB-01-01 | Only Data Collectors can access | Attempt to access the LGO Budget Allocation form as an unauthenticated public user | Access denied; form not reachable publicly. |
| TC-LGOB-01-02 | Full field capture | Complete and submit the form with valid data | Allocation, rationale, and recommendation fields all stored correctly. |

---

## US-LGOB-02 — LGO Budget Allocation data is aggregated on the public dashboard and downloadable

**Priority: Phase 2** *SRS Reference: LGO-03 / LGO-04*

*As a **member of the public / government partner**, I want **to see comparative budget priorities/recommendations across Local Governments on the public dashboard, and download the underlying data as CSV**, so that **cross-district comparison of government budget rationale becomes transparent and analysable**.*

### Acceptance Criteria

- Given multiple LGO Budget Allocation submissions across districts, when I view the public dashboard's relevant section, then a comparative visualisation across Local Governments is shown.
- Given that view, when I click download, then a CSV of the LGO Budget Allocation dataset downloads.

### Test Cases

| **Test ID** | **Description** | **Steps** | **Expected Result** |
|-------------|-----------------|-----------|---------------------|
| TC-LGOB-02-01 | Comparative view exists | Open the LGO Budget Allocation section of the public dashboard | Cross-district comparison visualisation is shown. |
| TC-LGOB-02-02 | CSV download | Click download | CSV file with LGO Budget Allocation data downloads. |