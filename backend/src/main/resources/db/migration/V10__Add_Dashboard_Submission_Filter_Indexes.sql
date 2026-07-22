-- V10: Composite indexes to support admin dashboard filter queries on submissions

CREATE INDEX idx_submissions_district_form_fy
    ON submissions (district_id, form_type, financial_year_period);

CREATE INDEX idx_submissions_collector_completed_at
    ON submissions (collector_id, form_completed_at);

CREATE INDEX idx_submissions_gender_age_group
    ON submissions (respondent_gender, respondent_age_group);
