import type { BudgetPrioritySection } from './budget-priority-section.model';

export const BUDGET_PRIORITY_ROUTES = {
  index: '/budget-priorities',
  section: (section: BudgetPrioritySection) => `/budget-priorities/${section}`,
} as const;
