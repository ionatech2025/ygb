import { describe, expect, it, vi } from 'vitest';
import {
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

describe('PublicDashboardService', () => {
  it('loads summary cards via the public dashboard API port', async () => {
    const fetchSummary = vi.fn().mockResolvedValue(sampleSummary);
    const api: IPublicDashboardApiPort = {
      fetchFilterOptions: vi.fn(),
      buildFilterQueryString: vi.fn(),
      fetchSummary,
    };

    const service = new PublicDashboardService(api);
    const cards = await service.loadSummaryCards(EMPTY_PUBLIC_DASHBOARD_FILTER);

    expect(fetchSummary).toHaveBeenCalledWith(EMPTY_PUBLIC_DASHBOARD_FILTER);
    expect(cards[0]?.primaryValue).toBe('42');
  });
});
