ALTER TABLE pc_submissions
    ADD COLUMN young_men_beneficiaries INT;

UPDATE pc_submissions
SET young_men_beneficiaries = GREATEST(youth_beneficiaries - young_women_beneficiaries, 0);

ALTER TABLE pc_submissions
    ALTER COLUMN young_men_beneficiaries SET NOT NULL;

ALTER TABLE pc_submissions
    ADD COLUMN programme_improvement_suggestion TEXT;

UPDATE pc_submissions
SET programme_improvement_suggestion = 'Historical submission — programme improvement suggestion not captured.';

ALTER TABLE pc_submissions
    ALTER COLUMN programme_improvement_suggestion SET NOT NULL;

UPDATE pc_submissions
SET pdc_effectiveness_rating = 'VERY_EFFECTIVE'
WHERE pdc_effectiveness_rating IN ('FULLY', 'HIGHLY_EFFECTIVE');

UPDATE pc_submissions
SET pdc_effectiveness_rating = 'EFFECTIVE'
WHERE pdc_effectiveness_rating IN ('MOSTLY', 'GOOD');

UPDATE pc_submissions
SET pdc_effectiveness_rating = 'MODERATELY_EFFECTIVE'
WHERE pdc_effectiveness_rating = 'SOME';

UPDATE pc_submissions
SET pdc_effectiveness_rating = 'SLIGHTLY_EFFECTIVE'
WHERE pdc_effectiveness_rating = 'HARDLY';

UPDATE pc_submissions
SET pdc_effectiveness_rating = 'NOT_EFFECTIVE_AT_ALL'
WHERE pdc_effectiveness_rating = 'NONE';
