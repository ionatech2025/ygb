import { apiFetch } from '../../../core/api/api-client';
import { buildLgoBudgetAllocationDashboardFilterQueryString } from '../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import type { LgoBudgetAllocationDashboardFilter } from '../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import type { LgoBudgetAllocationDashboardSummary } from '../../../core/domain/lgo-budget-allocation-dashboard-summary.model';
import type {
  LgoBudgetAllocationChartDataPoint,
  LgoBudgetAllocationChartSeries,
  LgoBudgetAllocationChartTypePath,
} from '../../../core/domain/lgo-budget-allocation-dashboard-charts.model';
import type {
  ILgoBudgetAllocationDashboardApiPort,
  LgoBudgetAllocationDashboardFilterOptions,
} from '../../../ports/lgo-budget-allocation-dashboard-api.port';

export const LGO_BUDGET_ALLOCATION_DASHBOARD_BASE = '/api/v1/public/dashboard/lgo-budget-allocation';

interface BackendLgoBudgetAllocationFilterOptionsResponse {
  genders: string[];
  ageGroups: string[];
  financialYearPeriods: string[];
}

interface BackendLgoBudgetAllocationDistrictCount {
  districtId: string;
  districtLabel: string;
  count: number;
}

interface BackendLgoBudgetAllocationSummaryResponse {
  totalSubmissions: number;
  byDistrict: BackendLgoBudgetAllocationDistrictCount[];
  topSectors: Array<{ sector: string; count: number }>;
}

interface BackendLgoBudgetAllocationChartDataPoint {
  label: string;
  date: string | null;
  bucketStart?: string | null;
  count: number;
}

interface BackendLgoBudgetAllocationChartSeriesResponse {
  chartType: LgoBudgetAllocationChartTypePath;
  data: BackendLgoBudgetAllocationChartDataPoint[];
}

export function mapLgoBudgetAllocationFilterOptions(
  response: BackendLgoBudgetAllocationFilterOptionsResponse
): LgoBudgetAllocationDashboardFilterOptions {
  return {
    genders: response.genders ?? [],
    ageGroups: response.ageGroups ?? [],
    financialYearPeriods: response.financialYearPeriods ?? [],
  };
}

export function mapLgoBudgetAllocationSummaryResponse(
  response: BackendLgoBudgetAllocationSummaryResponse
): LgoBudgetAllocationDashboardSummary {
  return {
    totalSubmissions: response.totalSubmissions ?? 0,
    byDistrict: (response.byDistrict ?? []).map((entry) => ({
      districtId: entry.districtId,
      districtLabel: entry.districtLabel,
      count: entry.count,
    })),
    topSectors: response.topSectors ?? [],
  };
}

export function mapLgoBudgetAllocationChartDataPoint(
  point: BackendLgoBudgetAllocationChartDataPoint
): LgoBudgetAllocationChartDataPoint {
  return {
    label: point.label,
    date: point.date ?? point.bucketStart ?? null,
    count: point.count,
  };
}

export function mapLgoBudgetAllocationChartSeriesResponse(
  response: BackendLgoBudgetAllocationChartSeriesResponse
): LgoBudgetAllocationChartSeries {
  return {
    chartType: response.chartType,
    data: (response.data ?? []).map(mapLgoBudgetAllocationChartDataPoint),
  };
}

export class HttpLgoBudgetAllocationDashboardAdapter implements ILgoBudgetAllocationDashboardApiPort {
  buildFilterQueryString(filter: LgoBudgetAllocationDashboardFilter): string {
    return buildLgoBudgetAllocationDashboardFilterQueryString(filter);
  }

  async fetchFilterOptions(
    districtId?: string,
    subcountyId?: string
  ): Promise<LgoBudgetAllocationDashboardFilterOptions> {
    const params = new URLSearchParams();
    if (districtId) params.set('districtId', districtId);
    if (subcountyId) params.set('subcountyId', subcountyId);
    const query = params.toString();

    const response = await apiFetch<BackendLgoBudgetAllocationFilterOptionsResponse>(
      `${LGO_BUDGET_ALLOCATION_DASHBOARD_BASE}/filters/options${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapLgoBudgetAllocationFilterOptions(response);
  }

  async fetchSummary(filter: LgoBudgetAllocationDashboardFilter): Promise<LgoBudgetAllocationDashboardSummary> {
    const query = this.buildFilterQueryString(filter).replace(/^\?/, '');
    const response = await apiFetch<BackendLgoBudgetAllocationSummaryResponse>(
      `${LGO_BUDGET_ALLOCATION_DASHBOARD_BASE}/summary${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapLgoBudgetAllocationSummaryResponse(response);
  }

  async fetchChart(
    chartType: LgoBudgetAllocationChartTypePath,
    filter: LgoBudgetAllocationDashboardFilter
  ): Promise<LgoBudgetAllocationChartSeries> {
    const baseQuery = this.buildFilterQueryString(filter).replace(/^\?/, '');
    const params = new URLSearchParams(baseQuery);
    if (chartType === 'over-time') {
      params.set('granularity', 'DAY');
    }
    const query = params.toString();
    const response = await apiFetch<BackendLgoBudgetAllocationChartSeriesResponse>(
      `${LGO_BUDGET_ALLOCATION_DASHBOARD_BASE}/charts/${chartType}${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapLgoBudgetAllocationChartSeriesResponse(response);
  }
}
