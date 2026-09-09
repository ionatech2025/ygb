import { describe, expect, it } from 'vitest';
import {
  buildToolFieldDownloadQueryString,
  downloadHubPath,
  emptyToolFieldDownloadFilter,
  parseToolDownloadDatasetParam,
  recentFinancialYearPeriodKeys,
  toolDownloadDatasetLabel,
} from './tool-field-download.model';

describe('tool-field-download.model', () => {
  it('parses hub dataset query params and rejects legacy PDM', () => {
    expect(parseToolDownloadDatasetParam('byp')).toBe('BYP');
    expect(parseToolDownloadDatasetParam('LGO_BUDGET_ALLOCATION')).toBe('LGO_BUDGET_ALLOCATION');
    expect(parseToolDownloadDatasetParam('PDM')).toBeNull();
    expect(parseToolDownloadDatasetParam('')).toBeNull();
  });

  it('builds optional AND filter query strings', () => {
    expect(buildToolFieldDownloadQueryString(emptyToolFieldDownloadFilter())).toBe('');
    expect(
      buildToolFieldDownloadQueryString({
        ...emptyToolFieldDownloadFilter(),
        districtId: 'd1',
        gender: 'FEMALE',
        financialYearPeriod: 'JAN_JUN_2026',
      })
    ).toBe('?districtId=d1&gender=FEMALE&financialYearPeriod=JAN_JUN_2026');
  });

  it('exposes display labels and hub deep links', () => {
    expect(toolDownloadDatasetLabel('BUDGET_PRIORITIES')).toBe('Budget Priorities');
    expect(toolDownloadDatasetLabel('LGO_BUDGET_ALLOCATION')).toBe('Budget Allocations');
    expect(downloadHubPath('BYP')).toBe('/download?dataset=BYP');
    expect(downloadHubPath()).toBe('/download');
  });

  it('lists recent financial year period keys', () => {
    const keys = recentFinancialYearPeriodKeys(new Date('2026-03-15T00:00:00Z'));
    expect(keys[0]).toBe('JUL_DEC_2027');
    expect(keys).toContain('JAN_JUN_2026');
  });
});
