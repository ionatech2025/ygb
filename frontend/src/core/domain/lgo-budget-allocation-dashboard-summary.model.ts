export interface LgoBudgetAllocationDistrictCount {
  districtId: string;
  districtLabel: string;
  count: number;
}

export interface LgoBudgetAllocationSectorCount {
  sector: string;
  count: number;
}

export interface LgoBudgetAllocationDashboardSummary {
  totalSubmissions: number;
  byDistrict: LgoBudgetAllocationDistrictCount[];
  topSectors: LgoBudgetAllocationSectorCount[];
}

export const EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_SUMMARY: LgoBudgetAllocationDashboardSummary = {
  totalSubmissions: 0,
  byDistrict: [],
  topSectors: [],
};
