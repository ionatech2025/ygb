CREATE TABLE active_fiscal_year_settings (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    fiscal_year_label VARCHAR(16) NOT NULL,
    effective_from TIMESTAMP NOT NULL DEFAULT NOW(),
    set_by_user_id UUID REFERENCES users (id)
);

INSERT INTO active_fiscal_year_settings (id, fiscal_year_label, effective_from, set_by_user_id)
VALUES (1, '2025/26', NOW(), NULL);
