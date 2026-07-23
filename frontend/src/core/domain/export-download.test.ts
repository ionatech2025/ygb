import { describe, expect, it } from 'vitest';
import {
  buildBudgetPriorityExportFallbackFilename,
  buildExportFallbackFilename,
  buildLgoBudgetAllocationExportFallbackFilename,
  parseContentDispositionFilename,
  shortFilterHash,
} from './export-download';
import { EMPTY_DASHBOARD_FILTER } from './dashboard-filter.model';
import { EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER } from './lgo-budget-allocation-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from './location-seed.constants';

describe('export download helpers', () => {
  it('parses filename from Content-Disposition', () => {
    expect(parseContentDispositionFilename('attachment; filename="submissions-export-20260315.csv"')).toBe(
      'submissions-export-20260315.csv'
    );
  });

  it('builds fallback filename with filter hash prefix', () => {
    const filename = buildExportFallbackFilename('csv', {
      ...EMPTY_DASHBOARD_FILTER,
      districtId: KAMPALA_DISTRICT_ID,
    });

    expect(filename).toMatch(/^ygb-export-[0-9a-f]{8}-\d{14}\.csv$/);
    expect(shortFilterHash({ ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID })).not.toBe(
      shortFilterHash(EMPTY_DASHBOARD_FILTER)
    );
  });

  it('builds budget priority fallback filename with section and timestamp', () => {
    expect(buildBudgetPriorityExportFallbackFilename('csv', { section: 'health' })).toMatch(
      /^ygb-budget-priorities-health-\d{14}\.csv$/
    );
    expect(buildBudgetPriorityExportFallbackFilename('xlsx', { section: '' })).toMatch(
      /^ygb-budget-priorities-all-sectors-\d{14}\.xlsx$/
    );
  });

  it('builds LGO budget allocation fallback filename with filter hint and timestamp', () => {
    expect(
      buildLgoBudgetAllocationExportFallbackFilename({
        ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
        districtId: KAMPALA_DISTRICT_ID,
      })
    ).toMatch(/^ygb-lgo-budget-allocation-district-[0-9a-f-]+-\d{14}\.csv$/);

    expect(
      buildLgoBudgetAllocationExportFallbackFilename(EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER)
    ).toMatch(/^ygb-lgo-budget-allocation-all-filters-\d{14}\.csv$/);
  });
});
