-- V4: Add partial unique index on submissions for synced respondent uniqueness
CREATE UNIQUE INDEX idx_unique_synced_respondent
ON submissions (respondent_phone, form_type, financial_year_period)
WHERE status = 'SYNCED';
