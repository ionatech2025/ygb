import { describe, expect, it } from 'vitest';
import {
  buildDownloadUsageAnalyticsQueryString,
  formatDownloaderFieldOfOperation,
  toGenderChartItems,
} from './download-usage-analytics.model';

describe('download-usage-analytics.model', () => {
  it('builds query string with age and gender filters plus pagination', () => {
    expect(
      buildDownloadUsageAnalyticsQueryString(
        { gender: 'FEMALE', ageGroup: 'AGE_18_24' },
        { page: 1, size: 25 }
      )
    ).toBe('?gender=FEMALE&ageGroup=AGE_18_24&page=1&size=25');
  });

  it('omits empty filter values', () => {
    expect(buildDownloadUsageAnalyticsQueryString({ gender: '', ageGroup: '' })).toBe('');
  });

  it('formats Other field of operation with specify text', () => {
    expect(formatDownloaderFieldOfOperation('OTHER', 'Consultant')).toBe('Other: Consultant');
    expect(formatDownloaderFieldOfOperation('ACADEMIA_RESEARCH', null)).toBe('Academia/Research');
  });

  it('maps gender aggregates to chart items with labels', () => {
    expect(toGenderChartItems([{ gender: 'FEMALE', count: 3 }])).toEqual([
      { gender: 'FEMALE', label: 'Female', count: 3 },
    ]);
  });
});
