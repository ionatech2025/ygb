export type BudgetPriorityChartTypePath = 'by-priority-area' | 'by-sector' | 'over-time';

export interface BudgetPriorityChartDataPoint {
  label: string;
  date: string | null;
  count: number;
}

export interface BudgetPriorityChartSeries {
  chartType: BudgetPriorityChartTypePath;
  data: BudgetPriorityChartDataPoint[];
}

export interface BudgetPriorityCountBarItem {
  label: string;
  count: number;
}

export interface BudgetPriorityTimeSeriesItem {
  date: string;
  label: string;
  count: number;
}

export interface BudgetPriorityDashboardChartsViewModel {
  byPriorityArea: BudgetPriorityCountBarItem[];
  bySector: BudgetPriorityCountBarItem[];
  overTime: BudgetPriorityTimeSeriesItem[];
}

export const EMPTY_BUDGET_PRIORITY_DASHBOARD_CHARTS: BudgetPriorityDashboardChartsViewModel = {
  byPriorityArea: [],
  bySector: [],
  overTime: [],
};
