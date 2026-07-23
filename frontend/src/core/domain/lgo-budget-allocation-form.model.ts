/** Placeholder draft shape for issue 002 — LGO Budget Allocation collector form. */
export type LgoBudgetAllocationFormDraft = {
  priorYearAllocations: Record<string, unknown>;
  rationale: string;
  recommendations: string;
};

export const EMPTY_LGO_BUDGET_ALLOCATION_FORM_DRAFT: LgoBudgetAllocationFormDraft = {
  priorYearAllocations: {},
  rationale: '',
  recommendations: '',
};
