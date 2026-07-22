import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DASHBOARD_FILTER } from '../../../core/domain/dashboard-filter.model';
import { HttpDashboardAdapter } from './dashboard-api.adapter';

describe('dashboard-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps overTime bucketStart to date for chart rendering', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          totalSubmissions: 18,
          byDistrict: [],
          byGender: [],
          overTime: [
            { bucketStart: '2026-03-10', count: 4 },
            { bucketStart: '2026-04-18', count: 2 },
          ],
          byFormType: [],
          byFinancialYearPeriod: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpDashboardAdapter(() => 'admin-token');
    const aggregates = await adapter.fetchAggregates(EMPTY_DASHBOARD_FILTER);

    expect(aggregates.overTime).toEqual([
      { date: '2026-03-10', count: 4 },
      { date: '2026-04-18', count: 2 },
    ]);
  });
});
