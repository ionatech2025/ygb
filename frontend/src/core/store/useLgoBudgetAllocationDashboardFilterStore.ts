import { create } from 'zustand';
import {
  applyLgoBudgetAllocationDashboardFilterPatch,
  EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
  type LgoBudgetAllocationDashboardFilter,
} from '../domain/lgo-budget-allocation-dashboard-filter.model';

interface LgoBudgetAllocationDashboardFilterStore {
  filter: LgoBudgetAllocationDashboardFilter;
  locationFilterError: string | null;
  setFilter: (patch: Partial<LgoBudgetAllocationDashboardFilter>) => void;
  replaceFilter: (filter: LgoBudgetAllocationDashboardFilter) => void;
  clearAll: () => void;
  setLocationFilterError: (message: string | null) => void;
}

function touchesLocation(patch: Partial<LgoBudgetAllocationDashboardFilter>): boolean {
  return 'districtId' in patch || 'subcountyId' in patch || 'parishId' in patch;
}

export const useLgoBudgetAllocationDashboardFilterStore = create<LgoBudgetAllocationDashboardFilterStore>(
  (set) => ({
    filter: EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
    locationFilterError: null,
    setFilter: (patch) =>
      set((state) => ({
        filter: applyLgoBudgetAllocationDashboardFilterPatch(state.filter, patch),
        locationFilterError: touchesLocation(patch) ? null : state.locationFilterError,
      })),
    replaceFilter: (filter) => set({ filter }),
    clearAll: () => set({ filter: EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER, locationFilterError: null }),
    setLocationFilterError: (message) => set({ locationFilterError: message }),
  })
);
