# PDM Tools — Required Changes (Youth Go Budget App)
**Source:** Impromptu Google Meet, July 28 — Samuel Katongole (developer), Maryimmaculate Kiyai, sky/Evelyn Mugisha, Patricia Nakitto
**Scope:** Enumerator (Data Collector) portal — all four PDM tools: Beneficiary Young Person, Individual Young Person, Local Government Official, Parish Chief

---

## 1. Cross-cutting changes (apply to ALL four tools)

1. **Enumerator/data collector identification**
   - Confirm that every form submission already records which enumerator (data collector account) submitted it, visible to the admin on the back end (who posted, which form, when).
   - To be confirmed through testing rather than a new build — flag as a test item, not a code change, unless testing shows it's missing.

2. **Respondent name field**
   - Keep the "Name of respondent" field, but make it **optional, not mandatory** — PDM data is sensitive and some respondents won't want their names recorded.

3. **Remove "exact age" field**
   - Since age is already captured via age brackets, drop the free-text/exact-age question entirely (was only meaningful before brackets existed).

4. **Age brackets — redefine to match program target (18–35)**
   - Current brackets spill over the target range. Replace with:
     - Below 18 (out of program scope — no child protection policy in place, so under-18s are not engaged)
     - 18–24 (or similar sub-band within target)
     - 25–29
     - 30–35
     - Above 35 (outlier/spillover)
   - Goal: cleanly isolate the 18–35 target population from outliers in reporting.

5. **No introductory-statement field needed**
   - Data collectors already carry a physical introduction letter; no in-app introductory statement/section is required.

6. **District/sub-county/parish naming inconsistency**
   - Fix inconsistent labelling in dropdowns (e.g., "Parish 1" vs "Parish I" — mixed numerals/letters, mixed capitalization). Likely a typo carried over from the source reference document, so use lowercase roman numerals.
   - Apply the same fix across **all divisions, sub-counties, and villages** — must be corrected individually per entry (no bulk/global fix available).

7. **Unpack/expand brief questions into full sentences**
   - Many questions are too terse (e.g., "Fund receipt duration") and risk being misinterpreted or inconsistently explained by different enumerators.
   - Rewrite all short/ambiguous questions in **plain, simple English**, spelled out as full, self-explanatory sentences — minimize reliance on enumerator improvisation/probing.
   - Reasoning explicitly discussed: consistent wording protects data quality across enumerators and literacy levels (Kampala + Ntungamo, mixed education levels).

8. **Multi-select hints**
   - For every question where more than one option may be selected, add a bracketed hint: **"(select all that apply)"**.

9. **"Other (specify)" free-text box**
   - Wherever an "Other" option exists, ensure there is an actual **text entry field** for the respondent's specified answer — several instances were missing this.

10. **Spell out acronyms**
    - "PDC" → **Parish Development Committee** (write in full at least once in the question, since PDC is not universally understood; PDM itself is well known and can stay as-is).

11. **"Suggestions for improvement" question**
    - Clarify that this question refers to **suggestions for improving the PDM program** (not the specific survey/category). Apply this clarified wording **across every tool**, including the Parish Chief tool (Evelyn asked for it to be added there too, to capture parish-level insight).

12. **Beneficiary counts — precise wording**
    - Where a question refers to "young people under 30," clarify that it specifically means **beneficiaries** under 30 (not the general youth population), to avoid ambiguity between "youth" and "PDM beneficiaries."

13. **Gender breakdown — capture explicitly, don't infer**
    - Wherever "young people/beneficiaries" totals are captured, **add separate fields for young women and young men** (do not require subtracting one from the total to infer the other). This lets totals be cross-validated (women + men = total).
    - Applies to Beneficiary, Individual, Local Government Official, and Parish Chief tools.

---

## 2. Tool: Beneficiary Young Person

- All cross-cutting items above apply (enumerator name, optional respondent name, age brackets, remove exact age, district naming fix, unpack questions, multi-select hints, other-specify boxes).
- **Q: Installment period** — Currently unclear whether it refers to receiving money or disbursing/paying back money. Rephrase to clearly state the question is about **the installment period for receiving funds**.
- **PDC** question — spell out "Parish Development Committee."
- **Suggestions for improvement** — clarify as "suggestions to improve the PDM program."

## 3. Tool: Individual Young Person

- All cross-cutting items apply (name, age brackets, district naming, gender split, etc.).
- **Question numbering/skip logic** — Confirmed working as intended (later questions are conditional on earlier answers, e.g., Q2→Q10, Q3→Q6 depending on yes/no); no change needed, just confirm this is clear to enumerators.
- **"How did you get information about PDM?"** — Add "(select all that apply)" hint; ensure "Other (specify)" has a text box. Same fix needed on the equivalent later question (Q10).
- **Suggestions for improvement** — same clarified wording as other tools.

## 4. Tool: Local Government Official

- **Fiscal year selector**
  - Clarify the question's intent: the fiscal year selected should reflect **the fiscal year the data being reported belongs to** (not necessarily the year data collection is happening in), while defaulting to the current period.
  - Reorder the dropdown so the **current/target fiscal year (2025–2026) appears first/top**, with other years available below for flexibility (e.g., future re-use of the tool, or ad hoc historical data collection).
  - **Decision:** Do not hard-lock the field via a static value (would require manual edits every cycle and defeats the purpose of the system). Instead:
    - Add an **admin-side control** where the admin sets/selects the "current" fiscal year for the data collection round.
    - The data collector's form reflects the admin-selected year (read-only or defaulted) rather than letting each enumerator pick freely — reduces risk of accidental wrong-year selection during fieldwork.
- **Two-year comparison for funds questions**
  - Expected funds / actual funds received questions need to capture **two financial years** (current: 2025–2026, and prior: 2024–2025) for effectiveness comparison — not just one. This two fiscal year duplication applies for Q1 to Q3.
  - Duplicate/structure these as, e.g., **Q3(a)** and **Q3(b)** rather than two separately numbered "Q3" fields, to avoid confusing duplicate numbering.
- **"Young people under 30" → "Beneficiaries under 30"**
  - Reword to specify **beneficiaries**, not general youth population.
  - Add separate **young women** and **young men** beneficiary count fields (see cross-cutting item 13).
- **Total parishes questions — clarify wording**
  - Distinguish clearly between:
    - **Total number of parishes in the district**, and
    - **Total number of parishes that received PDM funds**
  - Add "in the district" and "PDM" explicitly to each label so the distinction is unambiguous.
- **Suggestions for improvement** — same clarified wording as other tools.

## 5. Tool: Parish Chief

- **Add question numbering** — this tool currently has no question numbers; add them (consistent with other tools).
- **Gender split** — same as cross-cutting item 13: add young women / young men fields alongside the general beneficiary count.
- **PDC effectiveness rating — reword the rating scale**
  - Current options (fully / mostly / some / hardly / none) are unclear on-screen (dropdown doesn't render during screen share, and wording is ambiguous).
  - Replace with a standard effectiveness scale: **Very effective / Effective / Moderately effective / Slightly effective / Not effective at all**.
- **Section title fix** — Rename "Monitoring and Oversight" section to **"PDM Program Monitoring and Oversight"** for clarity.
- **Multi-select hint** — Add "(select all that apply)" to the monitoring/oversight question(s) where multiple parties/methods can be selected.
- **Self-reliance section — unclear questions**
  - "Self-reliant beneficiaries count" and "self-reliance group projects count" (e.g., number of PDM beneficiaries who started agricultural enterprises) need to be **rewritten in full, clear sentences** — current phrasing is not self-explanatory.
- **Suggestions for improvement** — add this question here too (was initially unclear if applicable to Parish Chiefs; confirmed yes — parish chiefs may have valuable input on program changes).

---

## 6. Open / to-confirm items (not yet resolved in this meeting)

- Confirm via testing that enumerator identity is actually captured and visible to admin per submission.
- Finalize exact wording for the fiscal-year question once the admin-lock mechanism is built (developer to draft, team to review).
- Confirm whether the "select all that apply" and "Other, specify" fixes are needed on any additional questions not explicitly walked through (e.g., further down in Parish Chief tool, which the call did not fully complete before ending).

---

## 7. Ownership / Next steps

- **Samuel (developer):** Implement all wording, field, and structural changes above; correct district/parish naming inconsistencies division-by-division; build the admin-side fiscal-year control.
- **Team (Maryimmaculate, Evelyn):** Review revised question wording once drafted, and plan enumerator training to cover: (a) correct use of the fiscal-year selector logic, and (b) consistent interpretation of unpacked questions.
- Once changes are made, team to conduct a **trial run** of the app (mentioned as ready to proceed at end of meeting).
