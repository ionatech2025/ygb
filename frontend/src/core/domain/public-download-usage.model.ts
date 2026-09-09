import { TOOL_DOWNLOAD_DATASET_OPTIONS } from './tool-field-download.model';

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

/**
 * Display labels for download-usage charts (public + admin).
 * Aligns with backend ToolDownloadCatalogue.analyticsDisplayLabel.
 */
export function formatDatasetLabel(dataset: string): string {
  const normalized = dataset.trim().toUpperCase();
  if (normalized === 'PDM' || normalized === 'PUBLIC_SUBMISSIONS') {
    return 'PDM (legacy)';
  }
  const hub = TOOL_DOWNLOAD_DATASET_OPTIONS.find((option) => option.value === normalized);
  if (hub) {
    return hub.label;
  }
  return dataset;
}
