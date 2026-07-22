import { create } from 'zustand';
import {
  applyDashboardFilterPatch,
  DashboardFilter,
  EMPTY_DASHBOARD_FILTER,
} from '../domain/dashboard-filter.model';

interface DashboardFilterStore {
  filter: DashboardFilter;
  locationFilterError: string | null;
  setFilter: (patch: Partial<DashboardFilter>) => void;
  replaceFilter: (filter: DashboardFilter) => void;
  clearAll: () => void;
  setLocationFilterError: (message: string | null) => void;
}

function touchesLocation(patch: Partial<DashboardFilter>): boolean {
  return 'districtId' in patch || 'subcountyId' in patch || 'parishId' in patch;
}

export const useDashboardFilterStore = create<DashboardFilterStore>((set) => ({
  filter: EMPTY_DASHBOARD_FILTER,
  locationFilterError: null,
  setFilter: (patch) =>
    set((state) => ({
      filter: applyDashboardFilterPatch(state.filter, patch),
      locationFilterError: touchesLocation(patch) ? null : state.locationFilterError,
    })),
  replaceFilter: (filter) => set({ filter }),
  clearAll: () => set({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null }),
  setLocationFilterError: (message) => set({ locationFilterError: message }),
}));
