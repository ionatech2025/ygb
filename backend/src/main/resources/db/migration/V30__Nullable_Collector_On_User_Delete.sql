-- Allow deleting data-collector users without cascading submission data.
-- Submissions keep their answers; collector_id becomes NULL when the user is removed.

ALTER TABLE submissions
    DROP CONSTRAINT IF EXISTS submissions_collector_id_fkey;

ALTER TABLE submissions
    ALTER COLUMN collector_id DROP NOT NULL;

ALTER TABLE submissions
    ADD CONSTRAINT submissions_collector_id_fkey
        FOREIGN KEY (collector_id) REFERENCES users (id) ON DELETE SET NULL;

ALTER TABLE active_fiscal_year_settings
    DROP CONSTRAINT IF EXISTS active_fiscal_year_settings_set_by_user_id_fkey;

ALTER TABLE active_fiscal_year_settings
    ADD CONSTRAINT active_fiscal_year_settings_set_by_user_id_fkey
        FOREIGN KEY (set_by_user_id) REFERENCES users (id) ON DELETE SET NULL;
