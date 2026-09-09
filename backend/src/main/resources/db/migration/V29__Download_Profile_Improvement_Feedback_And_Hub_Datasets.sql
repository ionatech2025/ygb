-- V29: optional improvement feedback on download profiles; widen download_events.dataset CHECK for hub tools

ALTER TABLE download_profiles
    ADD COLUMN improvement_feedback TEXT;

ALTER TABLE download_events
    DROP CONSTRAINT IF EXISTS download_events_dataset_check;

ALTER TABLE download_events
    ADD CONSTRAINT download_events_dataset_check
        CHECK (dataset IN (
            'PDM',
            'BYP',
            'IYP',
            'PC',
            'LGO',
            'BUDGET_PRIORITIES',
            'LGO_BUDGET_ALLOCATION'
        ));
