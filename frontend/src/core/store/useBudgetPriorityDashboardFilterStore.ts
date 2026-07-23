import { create } from 'zustand';
import {
  applyBudgetPriorityDashboardFilterPatch,
  BudgetPriorityDashboardFilter,
  EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
} from '../domain/budget-priority-dashboard-filter.model';

interface BudgetPriorityDashboardFilterStore {
  filter: BudgetPriorityDashboardFilter;
  locationFilterError: string | null;
  setFilter: (patch: Partial<BudgetPriorityDashboardFilter>) => void;
  replaceFilter: (filter: BudgetPriorityDashboardFilter) => void;
  clearAll: () => void;
  setLocationFilterError: (message: string | null) => void;
}

function touchesLocation(patch: Partial<BudgetPriorityDashboardFilter>): boolean {
  return 'districtId' in patch || 'subcountyId' in patch || 'parishId' in patch;
}

export const useBudgetPriorityDashboardFilterStore = create<BudgetPriorityDashboardFilterStore>((set) => ({
  filter: EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
  locationFilterError: null,
  setFilter: (patch) =>
    set((state) => ({
      filter: applyBudgetPriorityDashboardFilterPatch(state.filter, patch),
      locationFilterError: touchesLocation(patch) ? null : state.locationFilterError,
    })),
  replaceFilter: (filter) => set({ filter }),
  clearAll: () => set({ filter: EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER, locationFilterError: null }),
  setLocationFilterError: (message) => set({ locationFilterError: message }),
}));
