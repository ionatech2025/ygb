-- Jul 2026 cross-cutting: optional respondent name, new age brackets, drop BYP exact_age.

UPDATE submissions SET respondent_age_group = 'AGE_18_24' WHERE respondent_age_group = 'AGE_15_19';
UPDATE submissions SET respondent_age_group = 'AGE_18_24' WHERE respondent_age_group = 'AGE_20_24';
UPDATE submissions SET respondent_age_group = 'AGE_ABOVE_35' WHERE respondent_age_group = 'AGE_30_AND_ABOVE';

ALTER TABLE submissions ALTER COLUMN respondent_name DROP NOT NULL;

ALTER TABLE byp_submissions DROP COLUMN IF EXISTS exact_age;
