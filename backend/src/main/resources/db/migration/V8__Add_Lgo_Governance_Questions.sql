-- V8: LGO governance questions Q4–Q7 (funding equity / oversight assessments)

ALTER TABLE lgo_submissions
    ADD COLUMN funds_allocated_equitably BOOLEAN,
    ADD COLUMN allocated_funds_sufficient BOOLEAN,
    ADD COLUMN adequate_utilisation_oversight BOOLEAN,
    ADD COLUMN transparent_beneficiary_selection BOOLEAN;

UPDATE lgo_submissions
SET funds_allocated_equitably = TRUE,
    allocated_funds_sufficient = TRUE,
    adequate_utilisation_oversight = TRUE,
    transparent_beneficiary_selection = TRUE
WHERE funds_allocated_equitably IS NULL;

ALTER TABLE lgo_submissions
    ALTER COLUMN funds_allocated_equitably SET NOT NULL,
    ALTER COLUMN allocated_funds_sufficient SET NOT NULL,
    ALTER COLUMN adequate_utilisation_oversight SET NOT NULL,
    ALTER COLUMN transparent_beneficiary_selection SET NOT NULL;
