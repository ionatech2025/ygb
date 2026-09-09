import { describe, expect, it } from 'vitest';
import {
  EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES,
  formatDatasetLabel,
} from './public-download-usage.model';

describe('public-download-usage.model', () => {
  it('exposes empty aggregates defaults', () => {
    expect(EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES.totalDownloads).toBe(0);
    expect(EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES.byDataset).toEqual([]);
  });

  it('labels hub tools and PDM legacy for analytics charts', () => {
    expect(formatDatasetLabel('PUBLIC_SUBMISSIONS')).toBe('PDM (legacy)');
    expect(formatDatasetLabel('PDM')).toBe('PDM (legacy)');
    expect(formatDatasetLabel('BYP')).toBe('BYP');
    expect(formatDatasetLabel('IYP')).toBe('IYP');
    expect(formatDatasetLabel('PC')).toBe('PC');
    expect(formatDatasetLabel('LGO')).toBe('LGO');
    expect(formatDatasetLabel('BUDGET_PRIORITIES')).toBe('Budget Priorities');
    expect(formatDatasetLabel('LGO_BUDGET_ALLOCATION')).toBe('Budget Allocations');
    expect(formatDatasetLabel('CUSTOM_DATASET')).toBe('CUSTOM_DATASET');
  });
});
