import { describe, expect, it } from 'vitest';
import {
  EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES,
  formatDatasetLabel,
} from './public-download-usage.model';

describe('public-download-usage.model', () => {
  it('has correct default empty aggregates', () => {
    expect(EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES).toEqual({
      totalDownloads: 0,
      byDataset: [],
      downloadsOverTime: [],
    });
  });

  it('formats dataset enum keys to human-readable dataset labels', () => {
    expect(formatDatasetLabel('PUBLIC_SUBMISSIONS')).toBe('PDM Submissions');
    expect(formatDatasetLabel('PDM')).toBe('PDM Submissions');
    expect(formatDatasetLabel('BUDGET_PRIORITIES')).toBe('Budget Priorities');
    expect(formatDatasetLabel('LGO_BUDGET_ALLOCATION')).toBe('LGO Budget Allocation');
    expect(formatDatasetLabel('CUSTOM_DATASET')).toBe('CUSTOM_DATASET');
  });
});
