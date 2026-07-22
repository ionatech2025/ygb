import { create } from 'zustand';
import {
  applyPublicDashboardFilterPatch,
  EMPTY_PUBLIC_DASHBOARD_FILTER,
  PublicDashboardFilter,
} from '../domain/public-dashboard-filter.model';

interface PublicDashboardFilterStore {
  filter: PublicDashboardFilter;
  locationFilterError: string | null;
  setFilter: (patch: Partial<PublicDashboardFilter>) => void;
  replaceFilter: (filter: PublicDashboardFilter) => void;
  clearAll: () => void;
  setLocationFilterError: (message: string | null) => void;
}

function touchesLocation(patch: Partial<PublicDashboardFilter>): boolean {
  return 'districtId' in patch || 'subcountyId' in patch || 'parishId' in patch;
}

export const usePublicDashboardFilterStore = create<PublicDashboardFilterStore>((set) => ({
  filter: EMPTY_PUBLIC_DASHBOARD_FILTER,
  locationFilterError: null,
  setFilter: (patch) =>
    set((state) => ({
      filter: applyPublicDashboardFilterPatch(state.filter, patch),
      locationFilterError: touchesLocation(patch) ? null : state.locationFilterError,
    })),
  replaceFilter: (filter) => set({ filter }),
  clearAll: () => set({ filter: EMPTY_PUBLIC_DASHBOARD_FILTER, locationFilterError: null }),
  setLocationFilterError: (message) => set({ locationFilterError: message }),
}));
