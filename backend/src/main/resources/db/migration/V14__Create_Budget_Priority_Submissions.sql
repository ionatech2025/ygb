-- V14: Budget Priorities submissions (Phase 2)
CREATE TABLE budget_priority_submissions (
    bp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) NOT NULL,
    section VARCHAR(20) NOT NULL
        CHECK (section IN ('HEALTH','AGRICULTURE','EDUCATION','CLIMATE')),
    priority_areas JSONB,
    demographic_data JSONB,
    financial_year_period VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uniq_bp_phone_section_period
    ON budget_priority_submissions (phone_number, section, financial_year_period);
