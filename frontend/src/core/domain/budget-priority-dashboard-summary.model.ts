export interface BudgetPrioritySectionCount {
  section: string;
  count: number;
}

export interface BudgetPriorityAreaCount {
  priorityArea: string;
  count: number;
}

export interface BudgetPriorityDashboardSummary {
  totalSubmissions: number;
  bySection: BudgetPrioritySectionCount[];
  topPriorityAreas: BudgetPriorityAreaCount[];
}

export const EMPTY_BUDGET_PRIORITY_DASHBOARD_SUMMARY: BudgetPriorityDashboardSummary = {
  totalSubmissions: 0,
  bySection: [],
  topPriorityAreas: [],
};
