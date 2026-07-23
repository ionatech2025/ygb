import type { BudgetPriorityDashboardFilter } from '../core/domain/budget-priority-dashboard-filter.model';
import type { BudgetPriorityDashboardSummary } from '../core/domain/budget-priority-dashboard-summary.model';
import type {
  BudgetPriorityChartSeries,
  BudgetPriorityChartTypePath,
} from '../core/domain/budget-priority-dashboard-charts.model';

export interface BudgetPriorityDashboardFilterOptions {
  sections: string[];
  genders: string[];
  ageGroups: string[];
  financialYearPeriods: string[];
}

export interface IBudgetPriorityDashboardApiPort {
  buildFilterQueryString(filter: BudgetPriorityDashboardFilter): string;
  fetchFilterOptions(districtId?: string, subcountyId?: string): Promise<BudgetPriorityDashboardFilterOptions>;
  fetchSummary(filter: BudgetPriorityDashboardFilter): Promise<BudgetPriorityDashboardSummary>;
  fetchChart(
    chartType: BudgetPriorityChartTypePath,
    filter: BudgetPriorityDashboardFilter
  ): Promise<BudgetPriorityChartSeries>;
}
