-- V3: Create locations and submission child tables for joined-table strategy

CREATE TABLE locations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- DISTRICT, SUBCOUNTY, PARISH, VILLAGE
    parent_id UUID REFERENCES locations(id)
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY,
    collector_id UUID NOT NULL REFERENCES users(id),
    device_submission_id UUID NOT NULL UNIQUE, -- idempotency key
    form_completed_at TIMESTAMP NOT NULL,
    financial_year_period VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    district_id UUID NOT NULL REFERENCES locations(id),
    subcounty_id UUID NOT NULL REFERENCES locations(id),
    parish_id UUID NOT NULL REFERENCES locations(id),
    village_id UUID NOT NULL REFERENCES locations(id),
    respondent_name VARCHAR(255) NOT NULL,
    respondent_phone VARCHAR(50) NOT NULL,
    respondent_gender VARCHAR(50) NOT NULL,
    respondent_age_group VARCHAR(50) NOT NULL,
    form_type VARCHAR(50) NOT NULL
);

CREATE TABLE byp_submissions (
    id UUID PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    exact_age INT NOT NULL,
    fund_receipt_duration VARCHAR(50) NOT NULL,
    fund_receipt_duration_specify TEXT,
    received_actual_amount_requested BOOLEAN NOT NULL,
    cash_amount_received BIGINT NOT NULL,
    instalment_period VARCHAR(50) NOT NULL,
    instalment_period_specify TEXT,
    service_rating VARCHAR(50) NOT NULL,
    performance_rating VARCHAR(50) NOT NULL,
    group_organized_transparently BOOLEAN NOT NULL,
    received_bds BOOLEAN NOT NULL,
    bds_services JSONB,
    improvement_suggestion TEXT NOT NULL
);

CREATE TABLE iyp_submissions (
    id UUID PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    aware_of_pdm BOOLEAN NOT NULL,
    eligible_criteria_aware BOOLEAN,
    applied_for_fund BOOLEAN,
    accessed_fund BOOLEAN,
    rejection_narrative TEXT,
    reasons_for_not_applying JSONB,
    information_channels JSONB,
    difficulties_faced JSONB,
    limitation_explanation TEXT,
    improvement_suggestion TEXT NOT NULL
);

CREATE TABLE lgo_submissions (
    id UUID PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    fiscal_year_records JSONB NOT NULL,
    funds_spent_as_required BOOLEAN NOT NULL,
    funds_spent_explanation TEXT,
    economic_transformation BOOLEAN NOT NULL,
    economic_transformation_explanation TEXT,
    improvement_suggestion TEXT NOT NULL
);

CREATE TABLE pc_submissions (
    id UUID PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    amount_expected BIGINT NOT NULL,
    amount_received BIGINT NOT NULL,
    total_beneficiaries INT NOT NULL,
    youth_beneficiaries INT NOT NULL,
    young_women_beneficiaries INT NOT NULL,
    obstacles_description TEXT NOT NULL,
    spending_targeted_to_most_in_need BOOLEAN NOT NULL,
    pdc_total_members INT NOT NULL,
    pdc_youth_members INT NOT NULL,
    pdc_women_members INT NOT NULL,
    pdc_training_received BOOLEAN NOT NULL,
    pdc_training_areas JSONB,
    pdc_effectiveness_rating VARCHAR(50) NOT NULL,
    monitored_by JSONB NOT NULL,
    monitored_by_others_specify VARCHAR(255),
    monitoring_method TEXT NOT NULL,
    report_shared_with_respondent BOOLEAN NOT NULL,
    improvements_seen BOOLEAN NOT NULL,
    improvements_seen_explanation TEXT,
    progress_reports_submitted BOOLEAN NOT NULL,
    progress_reports_submitted_explanation TEXT,
    self_reliance_beneficiaries_count INT NOT NULL,
    self_reliance_group_projects_count INT NOT NULL
);

-- Seed location data for testing
INSERT INTO locations (id, name, type, parent_id) VALUES
('d1111111-1111-1111-1111-111111111111', 'Arua', 'DISTRICT', NULL),
('e2222222-2222-2222-2222-222222222222', 'Arua Hill', 'SUBCOUNTY', 'd1111111-1111-1111-1111-111111111111'),
('b3333333-3333-3333-3333-333333333333', 'Mvara', 'PARISH', 'e2222222-2222-2222-2222-222222222222'),
('f4444444-4444-4444-4444-444444444444', 'Mvara West', 'VILLAGE', 'b3333333-3333-3333-3333-333333333333');
