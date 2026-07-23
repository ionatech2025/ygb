import { apiFetch } from '../../../core/api/api-client';
import { buildBudgetPriorityDashboardFilterQueryString } from '../../../core/domain/budget-priority-dashboard-filter.model';
import type { BudgetPriorityDashboardFilter } from '../../../core/domain/budget-priority-dashboard-filter.model';
import type { BudgetPriorityDashboardSummary } from '../../../core/domain/budget-priority-dashboard-summary.model';
import type {
  BudgetPriorityChartDataPoint,
  BudgetPriorityChartSeries,
  BudgetPriorityChartTypePath,
} from '../../../core/domain/budget-priority-dashboard-charts.model';
import type {
  BudgetPriorityDashboardFilterOptions,
  IBudgetPriorityDashboardApiPort,
} from '../../../ports/budget-priority-dashboard-api.port';

interface BackendBudgetPriorityFilterOptionsResponse {
  sections: string[];
  genders: string[];
  ageGroups: string[];
  financialYearPeriods: string[];
}

interface BackendBudgetPrioritySummaryResponse {
  totalSubmissions: number;
  bySection: Array<{ section: string; count: number }>;
  topPriorityAreas: Array<{ priorityArea: string; count: number }>;
}

interface BackendBudgetPriorityChartDataPoint {
  label: string;
  date: string | null;
  bucketStart?: string | null;
  count: number;
}

interface BackendBudgetPriorityChartSeriesResponse {
  chartType: BudgetPriorityChartTypePath;
  data: BackendBudgetPriorityChartDataPoint[];
}

export function mapBudgetPriorityFilterOptions(
  response: BackendBudgetPriorityFilterOptionsResponse
): BudgetPriorityDashboardFilterOptions {
  return {
    sections: response.sections ?? [],
    genders: response.genders ?? [],
    ageGroups: response.ageGroups ?? [],
    financialYearPeriods: response.financialYearPeriods ?? [],
  };
}

export function mapBudgetPrioritySummaryResponse(
  response: BackendBudgetPrioritySummaryResponse
): BudgetPriorityDashboardSummary {
  return {
    totalSubmissions: response.totalSubmissions ?? 0,
    bySection: response.bySection ?? [],
    topPriorityAreas: response.topPriorityAreas ?? [],
  };
}

export function mapBudgetPriorityChartDataPoint(
  point: BackendBudgetPriorityChartDataPoint
): BudgetPriorityChartDataPoint {
  return {
    label: point.label,
    date: point.date ?? point.bucketStart ?? null,
    count: point.count,
  };
}

export function mapBudgetPriorityChartSeriesResponse(
  response: BackendBudgetPriorityChartSeriesResponse
): BudgetPriorityChartSeries {
  return {
    chartType: response.chartType,
    data: (response.data ?? []).map(mapBudgetPriorityChartDataPoint),
  };
}

export class HttpBudgetPriorityDashboardAdapter implements IBudgetPriorityDashboardApiPort {
  buildFilterQueryString(filter: BudgetPriorityDashboardFilter): string {
    return buildBudgetPriorityDashboardFilterQueryString(filter);
  }

  async fetchFilterOptions(
    districtId?: string,
    subcountyId?: string
  ): Promise<BudgetPriorityDashboardFilterOptions> {
    const params = new URLSearchParams();
    if (districtId) params.set('districtId', districtId);
    if (subcountyId) params.set('subcountyId', subcountyId);
    const query = params.toString();

    const response = await apiFetch<BackendBudgetPriorityFilterOptionsResponse>(
      `/api/v1/public/dashboard/budget-priorities/filters/options${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapBudgetPriorityFilterOptions(response);
  }

  async fetchSummary(filter: BudgetPriorityDashboardFilter): Promise<BudgetPriorityDashboardSummary> {
    const query = this.buildFilterQueryString(filter).replace(/^\?/, '');
    const response = await apiFetch<BackendBudgetPrioritySummaryResponse>(
      `/api/v1/public/dashboard/budget-priorities/summary${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapBudgetPrioritySummaryResponse(response);
  }

  async fetchChart(
    chartType: BudgetPriorityChartTypePath,
    filter: BudgetPriorityDashboardFilter
  ): Promise<BudgetPriorityChartSeries> {
    const baseQuery = this.buildFilterQueryString(filter).replace(/^\?/, '');
    const params = new URLSearchParams(baseQuery);
    if (chartType === 'over-time') {
      params.set('granularity', 'DAY');
    }
    const query = params.toString();
    const response = await apiFetch<BackendBudgetPriorityChartSeriesResponse>(
      `/api/v1/public/dashboard/budget-priorities/charts/${chartType}${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapBudgetPriorityChartSeriesResponse(response);
  }
}
