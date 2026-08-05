export interface PublicDatasetDownloadCount {
  dataset: string;
  count: number;
}

export interface PublicTimeSeriesDownloadPoint {
  bucketStart: string;
  count: number;
}

export interface PublicDownloadUsageAggregates {
  totalDownloads: number;
  byDataset: PublicDatasetDownloadCount[];
  downloadsOverTime: PublicTimeSeriesDownloadPoint[];
}

export const EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES: PublicDownloadUsageAggregates = {
  totalDownloads: 0,
  byDataset: [],
  downloadsOverTime: [],
};

export function formatDatasetLabel(dataset: string): string {
  switch (dataset) {
    case 'PUBLIC_SUBMISSIONS':
    case 'PDM':
      return 'PDM Submissions';
    case 'BUDGET_PRIORITIES':
      return 'Budget Priorities';
    case 'LGO_BUDGET_ALLOCATION':
      return 'LGO Budget Allocation';
    default:
      return dataset;
  }
}
