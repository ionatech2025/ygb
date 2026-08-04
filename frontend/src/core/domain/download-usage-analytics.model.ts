import { GENDER_OPTIONS, formatAgeGroupLabel } from './form-validation.model';
import {
  DOWNLOAD_AGE_GROUP_OPTIONS,
  FIELD_OF_OPERATION_OPTIONS,
} from './download-profile.model';

export interface DownloadUsageAnalyticsFilter {
  gender: string;
  ageGroup: string;
}

export const EMPTY_DOWNLOAD_USAGE_ANALYTICS_FILTER: DownloadUsageAnalyticsFilter = {
  gender: '',
  ageGroup: '',
};

export interface DownloaderSummary {
  profileId: string;
  email: string;
  optionalName: string | null;
  countryCode: string;
  gender: string;
  ageGroup: string;
  fieldOfOperation: string;
  fieldOfOperationSpecify: string | null;
  registeredAt: string;
  downloadCount: number;
  lastDownloadedAt: string | null;
}

export interface DownloaderPage {
  items: DownloaderSummary[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GenderCountItem {
  gender: string;
  count: number;
}

export interface AgeGroupCountItem {
  ageGroup: string;
  count: number;
}

export interface DatasetDownloadCountItem {
  dataset: string;
  count: number;
}

export interface TimeSeriesPointItem {
  bucketStart: string;
  count: number;
}

export interface DownloadUsageAggregates {
  totalDownloaders: number;
  totalDownloads: number;
  byGender: GenderCountItem[];
  byAgeGroup: AgeGroupCountItem[];
  byDataset: DatasetDownloadCountItem[];
  downloadsOverTime: TimeSeriesPointItem[];
}

export interface VisitsVsDownloadsPoint {
  bucketStart: string;
  visitorCount: number;
  downloaderCount: number;
}

export interface VisitsVsDownloadsComparison {
  totalUniqueVisitors: number;
  totalUniqueDownloaders: number;
  overTime: VisitsVsDownloadsPoint[];
}

export const DOWNLOAD_USAGE_GENDER_FILTER_OPTIONS = [...GENDER_OPTIONS];

export const DOWNLOAD_USAGE_AGE_FILTER_OPTIONS = [...DOWNLOAD_AGE_GROUP_OPTIONS];

export function buildDownloadUsageAnalyticsQueryString(
  filter: DownloadUsageAnalyticsFilter,
  extras: Record<string, string | number | undefined> = {}
): string {
  const params = new URLSearchParams();
  if (filter.gender.trim()) {
    params.set('gender', filter.gender.trim());
  }
  if (filter.ageGroup.trim()) {
    params.set('ageGroup', filter.ageGroup.trim());
  }
  for (const [key, value] of Object.entries(extras)) {
    if (value === undefined || value === '') {
      continue;
    }
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function formatDownloaderGender(value: string): string {
  return GENDER_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function formatDownloaderFieldOfOperation(
  fieldOfOperation: string,
  specify: string | null | undefined
): string {
  const base =
    FIELD_OF_OPERATION_OPTIONS.find((option) => option.value === fieldOfOperation)?.label ??
    fieldOfOperation;
  if (fieldOfOperation === 'OTHER' && specify?.trim()) {
    return `${base}: ${specify.trim()}`;
  }
  return base;
}

export function formatDownloaderAgeGroup(value: string): string {
  return formatAgeGroupLabel(value);
}

export function toGenderChartItems(items: GenderCountItem[]) {
  return items.map((item) => ({
    gender: item.gender,
    label: formatDownloaderGender(item.gender),
    count: item.count,
  }));
}

export function toAgeGroupChartItems(items: AgeGroupCountItem[]) {
  return items.map((item) => ({
    ageGroup: item.ageGroup,
    label: formatDownloaderAgeGroup(item.ageGroup),
    count: item.count,
  }));
}

export function toDownloadsOverTimeChartItems(items: TimeSeriesPointItem[]) {
  return items.map((item) => ({
    date: item.bucketStart,
    label: item.bucketStart,
    count: item.count,
  }));
}
