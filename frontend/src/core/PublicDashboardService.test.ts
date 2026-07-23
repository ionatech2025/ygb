import { describe, expect, it, vi } from 'vitest';
import {
  mapPublicChartSeriesToViewModel,
  mapPublicSummaryToSummaryCards,
  PublicDashboardService,
} from './PublicDashboardService';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from './domain/public-dashboard-filter.model';
import type { PublicDashboardSummary } from './domain/public-dashboard-summary.model';
import type { IPublicDashboardApiPort } from '../ports/public-dashboard-api.port';

const sampleSummary: PublicDashboardSummary = {
  totalSubmissions: 42,
  byFormType: [
    { formType: 'BYP', count: 30 },
    { formType: 'IYP', count: 12 },
  ],
  byGender: [
    { gender: 'FEMALE', count: 25 },
    { gender: 'MALE', count: 17 },
  ],
  byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 42 }],
};

describe('mapPublicSummaryToSummaryCards', () => {
  it('maps API response to card labels correctly', () => {
    const cards = mapPublicSummaryToSummaryCards(sampleSummary);

    expect(cards).toHaveLength(4);
    expect(cards[0]).toMatchObject({ id: 'total-submissions', primaryValue: '42' });
    expect(cards[1]?.items).toEqual([
      { label: 'Beneficiary Young Person (BYP)', value: '30' },
      { label: 'Individual Young Person (IYP)', value: '12' },
    ]);
    expect(cards[2]?.items).toEqual([
      { label: 'Female', value: '25' },
      { label: 'Male', value: '17' },
    ]);
    expect(cards[3]?.items).toEqual([{ label: 'Jan–Jun 2026', value: '42' }]);
  });
});

describe('mapPublicChartSeriesToViewModel', () => {
  it('maps chart series to dashboard view models', () => {
    const viewModel = mapPublicChartSeriesToViewModel(
      {
        chartType: 'by-district',
        data: [{ label: 'Kampala', locationId: 'd1', date: null, count: 8 }],
      },
      {
        chartType: 'by-gender',
        data: [{ label: 'FEMALE', locationId: null, date: null, count: 5 }],
      },
      {
        chartType: 'by-age-group',
        data: [{ label: 'AGE_20_24', locationId: null, date: null, count: 3 }],
      },
      {
        chartType: 'trend',
        data: [{ label: '2026-03-15', locationId: null, date: '2026-03-15', count: 2 }],
      },
      [{ districtId: 'd1', parishId: null, label: 'Kampala', count: 8 }]
    );

    expect(viewModel.byDistrict[0]?.districtName).toBe('Kampala');
    expect(viewModel.byGender[0]?.label).toBe('Female');
    expect(viewModel.byAgeGroup[0]?.label).toBe('20-24');
    expect(viewModel.overTime[0]?.date).toBe('2026-03-15');
    expect(viewModel.heatmap).toHaveLength(1);
  });
});

describe('PublicDashboardService', () => {
  it('loads summary cards via the public dashboard API port', async () => {
    const fetchSummary = vi.fn().mockResolvedValue(sampleSummary);
    const api: IPublicDashboardApiPort = {
      fetchFilterOptions: vi.fn(),
      buildFilterQueryString: vi.fn(),
      fetchSummary,
      fetchChart: vi.fn(),
      fetchHeatmap: vi.fn(),
    };

    const service = new PublicDashboardService(api);
    const cards = await service.loadSummaryCards(EMPTY_PUBLIC_DASHBOARD_FILTER);

    expect(fetchSummary).toHaveBeenCalledWith(EMPTY_PUBLIC_DASHBOARD_FILTER);
    expect(cards[0]?.primaryValue).toBe('42');
  });
});
