ALTER TABLE byp_submissions
    ADD COLUMN funds_receipt_wait_after_applied TEXT,
    ADD COLUMN money_used_for TEXT,
    ADD COLUMN loan_repaid BOOLEAN,
    ADD COLUMN loan_repayment_duration VARCHAR(50);

UPDATE byp_submissions
SET funds_receipt_wait_after_applied = 'Historical submission — funds receipt wait after applied not captured.',
    money_used_for = 'Historical submission — money use not captured.',
    loan_repaid = FALSE
WHERE funds_receipt_wait_after_applied IS NULL
   OR money_used_for IS NULL
   OR loan_repaid IS NULL;

ALTER TABLE byp_submissions
    ALTER COLUMN funds_receipt_wait_after_applied SET NOT NULL,
    ALTER COLUMN money_used_for SET NOT NULL,
    ALTER COLUMN loan_repaid SET NOT NULL;

ALTER TABLE byp_submissions
    ALTER COLUMN instalment_period DROP NOT NULL;
