import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER } from '../../../core/domain/budget-priority-dashboard-filter.model';
import {
  HttpBudgetPriorityDashboardAdapter,
  mapBudgetPriorityChartSeriesResponse,
  mapBudgetPrioritySummaryResponse,
} from './budget-priority-dashboard-api.adapter';

describe('budget-priority-dashboard-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps summary API JSON to the domain summary model', () => {
    expect(
      mapBudgetPrioritySummaryResponse({
        totalSubmissions: 12,
        bySection: [{ section: 'health', count: 7 }],
        topPriorityAreas: [{ priorityArea: 'PRIMARY_HEALTH_CARE', count: 5 }],
      })
    ).toEqual({
      totalSubmissions: 12,
      bySection: [{ section: 'health', count: 7 }],
      topPriorityAreas: [{ priorityArea: 'PRIMARY_HEALTH_CARE', count: 5 }],
    });
  });

  it('maps chart series API JSON to the domain chart model', () => {
    expect(
      mapBudgetPriorityChartSeriesResponse({
        chartType: 'by-priority-area',
        data: [{ label: 'PRIMARY_HEALTH_CARE', date: null, count: 4 }],
      })
    ).toEqual({
      chartType: 'by-priority-area',
      data: [{ label: 'PRIMARY_HEALTH_CARE', date: null, count: 4 }],
    });
  });

  it('fetches summary from the public endpoint without an auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          totalSubmissions: 3,
          bySection: [{ section: 'health', count: 3 }],
          topPriorityAreas: [{ priorityArea: 'PRIMARY_HEALTH_CARE', count: 2 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpBudgetPriorityDashboardAdapter();
    const summary = await adapter.fetchSummary({
      ...EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
      section: 'health',
    });

    expect(summary.totalSubmissions).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/public/dashboard/budget-priorities/summary');
    expect(url).toContain('section=health');
    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).toBe(false);
  });
});
