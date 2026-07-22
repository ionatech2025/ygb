import { describe, expect, it } from 'vitest';
import {
  buildDashboardFilterQueryString,
  EMPTY_DASHBOARD_FILTER,
  hasActiveDashboardFilters,
  applyDashboardFilterPatch,
} from './dashboard-filter.model';

describe('dashboard-filter.model', () => {
  it('serializes combined filters to the correct query string (TC-DASH-02-03)', () => {
    const query = buildDashboardFilterQueryString({
      ...EMPTY_DASHBOARD_FILTER,
      districtId: 'district-1',
      formType: 'BYP',
      gender: 'FEMALE',
      dateFrom: '2026-01-01',
      collectorId: 'collector-9',
    });

    expect(query).toBe(
      '?districtId=district-1&formType=BYP&dateFrom=2026-01-01&gender=FEMALE&collectorId=collector-9'
    );
  });

  it('returns empty string when no filters are active', () => {
    expect(buildDashboardFilterQueryString(EMPTY_DASHBOARD_FILTER)).toBe('');
    expect(hasActiveDashboardFilters(EMPTY_DASHBOARD_FILTER)).toBe(false);
  });

  it('clears sub-county and parish when district changes', () => {
    const next = applyDashboardFilterPatch(
      {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: 'd1',
        subcountyId: 'sc1',
        parishId: 'p1',
      },
      { districtId: 'd2' }
    );

    expect(next).toMatchObject({
      districtId: 'd2',
      subcountyId: '',
      parishId: '',
    });
  });

  it('clears parish when sub-county changes', () => {
    const next = applyDashboardFilterPatch(
      {
        ...EMPTY_DASHBOARD_FILTER,
        subcountyId: 'sc1',
        parishId: 'p1',
      },
      { subcountyId: 'sc2' }
    );

    expect(next).toMatchObject({
      subcountyId: 'sc2',
      parishId: '',
    });
  });
});
