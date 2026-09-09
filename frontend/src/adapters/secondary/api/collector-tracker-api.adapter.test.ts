import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DASHBOARD_FILTER } from '../../../core/domain/dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../core/domain/location-seed.constants';
import { HttpCollectorTrackerAdapter } from './collector-tracker-api.adapter';

describe('collector-tracker-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes filter, page, and sort query params when fetching the leaderboard', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          totalElements: 0,
          page: 1,
          size: 10,
          totalPages: 0,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpCollectorTrackerAdapter(() => 'admin-token');
    await adapter.fetchLeaderboard(
      {
        ...EMPTY_DASHBOARD_FILTER,
        financialYearPeriod: 'JAN_JUN_2026',
        districtId: KAMPALA_DISTRICT_ID,
      },
      1,
      10,
      'fullName',
      'asc'
    );

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/collectors/leaderboard?');
    expect(fetchMock.mock.calls[0]?.[0]).toContain('financialYearPeriod=JAN_JUN_2026');
    expect(fetchMock.mock.calls[0]?.[0]).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(fetchMock.mock.calls[0]?.[0]).toContain('page=1');
    expect(fetchMock.mock.calls[0]?.[0]).toContain('size=10');
    expect(fetchMock.mock.calls[0]?.[0]).toContain('sort=fullName');
    expect(fetchMock.mock.calls[0]?.[0]).toContain('direction=asc');
  });
});
