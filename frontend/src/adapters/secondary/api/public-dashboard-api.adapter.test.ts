import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpPublicDashboardAdapter } from './public-dashboard-api.adapter';

describe('public-dashboard-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests filter options from the public endpoint without an auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          districts: [],
          subcounties: [],
          parishes: [],
          formTypes: ['BYP'],
          genders: ['FEMALE'],
          ageGroups: ['AGE_20_24'],
          financialYearPeriods: ['JAN_JUN_2026'],
          programmeAreas: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpPublicDashboardAdapter();
    const options = await adapter.fetchFilterOptions('district-1', 'subcounty-1');

    expect(options).toEqual({
      formTypes: ['BYP'],
      genders: ['FEMALE'],
      ageGroups: ['AGE_20_24'],
      financialYearPeriods: ['JAN_JUN_2026'],
      programmeAreas: [],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/public/dashboard/filters/options');
    expect(url).toContain('districtId=district-1');
    expect(url).toContain('subcountyId=subcounty-1');

    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).toBe(false);
  });
});
