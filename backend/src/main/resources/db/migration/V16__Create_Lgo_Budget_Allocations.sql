-- V16: LGO Budget Allocation records (Phase 2)
CREATE TABLE lgo_budget_allocations (
    lba_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id),
    previous_fy_allocations JSONB,
    rationale TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lgo_budget_allocations_submission_id
    ON lgo_budget_allocations (submission_id);

CREATE INDEX idx_lgo_budget_allocations_submitted_at
    ON lgo_budget_allocations (submitted_at);
