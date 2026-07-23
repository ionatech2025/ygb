import type { BudgetPrioritySection } from './budget-priority-section.model';

export const BUDGET_PRIORITY_ROUTES = {
  index: '/budget-priorities',
  dashboard: '/dashboard/budget-priorities',
  section: (section: BudgetPrioritySection) => `/budget-priorities/${section}`,
  success: (section: BudgetPrioritySection) => `/budget-priorities/${section}/success`,
} as const;
