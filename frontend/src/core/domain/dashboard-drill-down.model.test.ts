import { describe, expect, it } from 'vitest';
import { applyChartDrillDown, buildSubmissionListSearch } from './dashboard-drill-down.model';
import { EMPTY_DASHBOARD_FILTER } from './dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from './location-seed.constants';

describe('applyChartDrillDown', () => {
  it('applies district drill-down and clears lower location levels', () => {
    const next = applyChartDrillDown(EMPTY_DASHBOARD_FILTER, {
      dimension: 'district',
      value: KAMPALA_DISTRICT_ID,
    });

    expect(next.districtId).toBe(KAMPALA_DISTRICT_ID);
    expect(next.subcountyId).toBe('');
    expect(next.parishId).toBe('');
  });

  it('applies gender drill-down', () => {
    const next = applyChartDrillDown(EMPTY_DASHBOARD_FILTER, {
      dimension: 'gender',
      value: 'FEMALE',
    });

    expect(next.gender).toBe('FEMALE');
  });

  it('applies date drill-down to both date range fields', () => {
    const next = applyChartDrillDown(EMPTY_DASHBOARD_FILTER, {
      dimension: 'date',
      value: '2026-03-15',
    });

    expect(next.dateFrom).toBe('2026-03-15');
    expect(next.dateTo).toBe('2026-03-15');
  });
});

describe('buildSubmissionListSearch', () => {
  it('includes active filters and page number', () => {
    expect(
      buildSubmissionListSearch(
        { ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID },
        2
      )
    ).toBe(`?districtId=${KAMPALA_DISTRICT_ID}&page=2`);
  });
});
