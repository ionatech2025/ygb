import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER } from '../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import {
  HttpLgoBudgetAllocationDashboardAdapter,
  LGO_BUDGET_ALLOCATION_DASHBOARD_BASE,
  mapLgoBudgetAllocationChartSeriesResponse,
  mapLgoBudgetAllocationSummaryResponse,
} from './lgo-budget-allocation-dashboard-api.adapter';

describe('lgo-budget-allocation-dashboard-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps summary API JSON to the domain summary model', () => {
    expect(
      mapLgoBudgetAllocationSummaryResponse({
        totalSubmissions: 8,
        byDistrict: [{ districtId: 'd1', districtLabel: 'Kampala', count: 5 }],
        topSectors: [{ sector: 'health', count: 4 }],
      })
    ).toEqual({
      totalSubmissions: 8,
      byDistrict: [{ districtId: 'd1', districtLabel: 'Kampala', count: 5 }],
      topSectors: [{ sector: 'health', count: 4 }],
    });
  });

  it('maps chart series API JSON to the domain chart model', () => {
    expect(
      mapLgoBudgetAllocationChartSeriesResponse({
        chartType: 'by-district',
        data: [{ label: 'Kampala', date: null, count: 3 }],
      })
    ).toEqual({
      chartType: 'by-district',
      data: [{ label: 'Kampala', date: null, count: 3 }],
    });
  });

  it('fetches summary from the public endpoint without an auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          totalSubmissions: 3,
          byDistrict: [{ districtId: 'd1', districtLabel: 'Kampala', count: 3 }],
          topSectors: [{ sector: 'health', count: 2 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpLgoBudgetAllocationDashboardAdapter();
    const summary = await adapter.fetchSummary({
      ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
      districtId: 'd1',
    });

    expect(summary.totalSubmissions).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(`${LGO_BUDGET_ALLOCATION_DASHBOARD_BASE}/summary`);
    expect(url).toContain('districtId=d1');
    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).toBe(false);
  });
});
