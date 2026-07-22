import { describe, expect, it, vi } from 'vitest';
import { DashboardService, mapAggregatesToCharts, mapAggregatesToSummaryCards } from './DashboardService';
import type { DashboardAggregates } from './domain/dashboard-aggregates.model';
import { EMPTY_DASHBOARD_FILTER } from './domain/dashboard-filter.model';
import type { IDashboardApiPort } from '../ports/dashboard-api.port';

const sampleAggregates: DashboardAggregates = {
  totalSubmissions: 42,
  byDistrict: [
    { districtName: 'Arua', districtId: 'd1', count: 20 },
    { districtName: 'Kampala', districtId: 'd2', count: 15 },
    { districtName: 'Gulu', districtId: 'd3', count: 7 },
  ],
  byGender: [
    { gender: 'FEMALE', count: 25 },
    { gender: 'MALE', count: 17 },
  ],
  overTime: [{ date: '2026-03-15', count: 42 }],
  byFormType: [
    { formType: 'BYP', count: 30 },
    { formType: 'IYP', count: 12 },
  ],
  byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 42 }],
};

describe('mapAggregatesToSummaryCards', () => {
  it('maps API response to card labels correctly', () => {
    const cards = mapAggregatesToSummaryCards(sampleAggregates);

    expect(cards).toHaveLength(5);
    expect(cards[0]).toMatchObject({ id: 'total-submissions', primaryValue: '42' });
    expect(cards[1]?.items).toEqual([
      { label: 'Beneficiary Young Person (BYP)', value: '30' },
      { label: 'Individual Young Person (IYP)', value: '12' },
    ]);
    expect(cards[2]?.items?.map((item) => item.label)).toEqual(['Arua', 'Kampala', 'Gulu']);
    expect(cards[3]?.items).toEqual([
      { label: 'Female', value: '25' },
      { label: 'Male', value: '17' },
    ]);
    expect(cards[4]?.items).toEqual([{ label: 'Jan–Jun 2026', value: '42' }]);
  });
});

describe('mapAggregatesToCharts', () => {
  it('maps API response to chart view models', () => {
    const charts = mapAggregatesToCharts(sampleAggregates);

    expect(charts.byDistrict.map((entry) => entry.districtName)).toEqual(['Arua', 'Kampala', 'Gulu']);
    expect(charts.byGender).toEqual([
      { gender: 'FEMALE', label: 'Female', count: 25 },
      { gender: 'MALE', label: 'Male', count: 17 },
    ]);
    expect(charts.overTime).toEqual([
      { date: '2026-03-15', label: '15 Mar 2026', count: 42 },
    ]);
  });
});

describe('DashboardService', () => {
  it('loads summary cards via the dashboard API port', async () => {
    const fetchAggregates = vi.fn().mockResolvedValue(sampleAggregates);
    const api: IDashboardApiPort = {
      fetchFilterOptions: vi.fn(),
      buildFilterQueryString: vi.fn(),
      fetchAggregates,
    };

    const service = new DashboardService(api);
    const cards = await service.loadSummaryCards(EMPTY_DASHBOARD_FILTER);

    expect(fetchAggregates).toHaveBeenCalledWith(EMPTY_DASHBOARD_FILTER);
    expect(cards[0]?.primaryValue).toBe('42');
  });

  it('loads charts via the dashboard API port', async () => {
    const fetchAggregates = vi.fn().mockResolvedValue(sampleAggregates);
    const api: IDashboardApiPort = {
      fetchFilterOptions: vi.fn(),
      buildFilterQueryString: vi.fn(),
      fetchAggregates,
    };

    const service = new DashboardService(api);
    const charts = await service.loadCharts(EMPTY_DASHBOARD_FILTER);

    expect(fetchAggregates).toHaveBeenCalledWith(EMPTY_DASHBOARD_FILTER);
    expect(charts.byDistrict[0]?.districtName).toBe('Arua');
  });
});
