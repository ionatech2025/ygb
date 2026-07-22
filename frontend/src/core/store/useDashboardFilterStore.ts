import { create } from 'zustand';
import {
  applyDashboardFilterPatch,
  DashboardFilter,
  EMPTY_DASHBOARD_FILTER,
} from '../domain/dashboard-filter.model';

interface DashboardFilterStore {
  filter: DashboardFilter;
  setFilter: (patch: Partial<DashboardFilter>) => void;
  replaceFilter: (filter: DashboardFilter) => void;
  clearAll: () => void;
}

export const useDashboardFilterStore = create<DashboardFilterStore>((set) => ({
  filter: EMPTY_DASHBOARD_FILTER,
  setFilter: (patch) =>
    set((state) => ({
      filter: applyDashboardFilterPatch(state.filter, patch),
    })),
  replaceFilter: (filter) => set({ filter }),
  clearAll: () => set({ filter: EMPTY_DASHBOARD_FILTER }),
}));
