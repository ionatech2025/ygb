export type LgoBudgetAllocationChartTypePath = 'by-district' | 'by-sector' | 'over-time';

export interface LgoBudgetAllocationChartDataPoint {
  label: string;
  date: string | null;
  count: number;
}

export interface LgoBudgetAllocationChartSeries {
  chartType: LgoBudgetAllocationChartTypePath;
  data: LgoBudgetAllocationChartDataPoint[];
}

export interface LgoBudgetAllocationCountBarItem {
  label: string;
  count: number;
}

export interface LgoBudgetAllocationTimeSeriesItem {
  date: string;
  label: string;
  count: number;
}

export interface LgoBudgetAllocationDashboardChartsViewModel {
  byDistrict: LgoBudgetAllocationCountBarItem[];
  bySector: LgoBudgetAllocationCountBarItem[];
  overTime: LgoBudgetAllocationTimeSeriesItem[];
}

export const EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_CHARTS: LgoBudgetAllocationDashboardChartsViewModel = {
  byDistrict: [],
  bySector: [],
  overTime: [],
};
