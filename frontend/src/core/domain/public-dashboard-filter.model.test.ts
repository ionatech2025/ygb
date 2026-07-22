import { describe, expect, it } from 'vitest';
import {
  applyPublicDashboardFilterPatch,
  buildPublicDashboardFilterQueryString,
  EMPTY_PUBLIC_DASHBOARD_FILTER,
  hasActivePublicDashboardFilters,
} from './public-dashboard-filter.model';

describe('public-dashboard-filter.model', () => {
  it('serializes combined filters to the correct query string (TC-PUB-02-03)', () => {
    const query = buildPublicDashboardFilterQueryString({
      ...EMPTY_PUBLIC_DASHBOARD_FILTER,
      districtId: 'district-1',
      formType: 'BYP',
      gender: 'FEMALE',
      dateFrom: '2026-01-01',
      programmeArea: 'AGRICULTURE',
    });

    expect(query).toBe(
      '?districtId=district-1&formType=BYP&dateFrom=2026-01-01&gender=FEMALE&programmeArea=AGRICULTURE'
    );
  });

  it('returns empty string when no filters are active', () => {
    expect(buildPublicDashboardFilterQueryString(EMPTY_PUBLIC_DASHBOARD_FILTER)).toBe('');
    expect(hasActivePublicDashboardFilters(EMPTY_PUBLIC_DASHBOARD_FILTER)).toBe(false);
  });

  it('clears sub-county and parish when district changes', () => {
    const next = applyPublicDashboardFilterPatch(
      {
        ...EMPTY_PUBLIC_DASHBOARD_FILTER,
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
    const next = applyPublicDashboardFilterPatch(
      {
        ...EMPTY_PUBLIC_DASHBOARD_FILTER,
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
