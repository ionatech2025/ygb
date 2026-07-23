-- V17: Joined-table child for LGO Budget Allocation submission envelope (distinct from PDM LGO form)
CREATE TABLE lgo_budget_allocation_submissions (
    id UUID PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE
);
