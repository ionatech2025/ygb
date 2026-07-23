-- V15: Indexes for budget-priority dashboard aggregation queries
CREATE INDEX idx_bp_submissions_submitted_at ON budget_priority_submissions (submitted_at);
CREATE INDEX idx_bp_submissions_section ON budget_priority_submissions (section);
CREATE INDEX idx_bp_submissions_financial_year_period ON budget_priority_submissions (financial_year_period);
