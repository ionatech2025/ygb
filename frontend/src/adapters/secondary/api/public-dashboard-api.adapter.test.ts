import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../core/domain/public-dashboard-filter.model';
import {
  HttpPublicDashboardAdapter,
  mapPublicChartDataPoint,
  mapPublicChartSeriesResponse,
  mapPublicSummaryResponse,
} from './public-dashboard-api.adapter';

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

  it('maps summary API JSON to the domain summary model', () => {
    const summary = mapPublicSummaryResponse({
      totalSubmissions: 4,
      byFormType: [{ formType: 'BYP', count: 3 }],
      byGender: [{ gender: 'FEMALE', count: 2 }],
      byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 4 }],
    });

    expect(summary).toEqual({
      totalSubmissions: 4,
      byFormType: [{ formType: 'BYP', count: 3 }],
      byGender: [{ gender: 'FEMALE', count: 2 }],
      byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 4 }],
    });
  });

  it('maps bucketStart to date for trend chart points', () => {
    expect(
      mapPublicChartDataPoint({
        label: '2026-03-15',
        locationId: null,
        date: null,
        bucketStart: '2026-03-15',
        count: 2,
      })
    ).toEqual({
      label: '2026-03-15',
      locationId: null,
      date: '2026-03-15',
      count: 2,
    });
  });

  it('maps chart series API JSON to the domain chart model', () => {
    expect(
      mapPublicChartSeriesResponse({
        chartType: 'trend',
        data: [{ label: '2026-03-15', locationId: null, date: '2026-03-15', count: 2 }],
      })
    ).toEqual({
      chartType: 'trend',
      data: [{ label: '2026-03-15', locationId: null, date: '2026-03-15', count: 2 }],
    });
  });

  it('fetches summary from the public endpoint without an auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          totalSubmissions: 4,
          byFormType: [{ formType: 'BYP', count: 3 }],
          byGender: [{ gender: 'FEMALE', count: 2 }],
          byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 4 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpPublicDashboardAdapter();
    const summary = await adapter.fetchSummary({
      ...EMPTY_PUBLIC_DASHBOARD_FILTER,
      gender: 'FEMALE',
    });

    expect(summary.totalSubmissions).toBe(4);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/public/dashboard/summary');
    expect(url).toContain('gender=FEMALE');
    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).toBe(false);
  });
});
