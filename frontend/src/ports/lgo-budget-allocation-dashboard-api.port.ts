import type { LgoBudgetAllocationDashboardFilter } from '../core/domain/lgo-budget-allocation-dashboard-filter.model';
import type { LgoBudgetAllocationDashboardSummary } from '../core/domain/lgo-budget-allocation-dashboard-summary.model';
import type {
  LgoBudgetAllocationChartSeries,
  LgoBudgetAllocationChartTypePath,
} from '../core/domain/lgo-budget-allocation-dashboard-charts.model';

export interface LgoBudgetAllocationDashboardFilterOptions {
  genders: string[];
  ageGroups: string[];
  financialYearPeriods: string[];
}

export interface ILgoBudgetAllocationDashboardApiPort {
  buildFilterQueryString(filter: LgoBudgetAllocationDashboardFilter): string;
  fetchFilterOptions(districtId?: string, subcountyId?: string): Promise<LgoBudgetAllocationDashboardFilterOptions>;
  fetchSummary(filter: LgoBudgetAllocationDashboardFilter): Promise<LgoBudgetAllocationDashboardSummary>;
  fetchChart(
    chartType: LgoBudgetAllocationChartTypePath,
    filter: LgoBudgetAllocationDashboardFilter
  ): Promise<LgoBudgetAllocationChartSeries>;
}
