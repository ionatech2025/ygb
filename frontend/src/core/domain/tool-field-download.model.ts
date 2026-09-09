import type { PublicExportFormat } from './public-export.model';

/** Six field-data tools available on the public/admin download hubs (not legacy PDM). */
export const TOOL_DOWNLOAD_DATASETS = [
  'BYP',
  'IYP',
  'PC',
  'LGO',
  'BUDGET_PRIORITIES',
  'LGO_BUDGET_ALLOCATION',
] as const;

export type ToolDownloadDataset = (typeof TOOL_DOWNLOAD_DATASETS)[number];

export const TOOL_DOWNLOAD_DATASET_OPTIONS: ReadonlyArray<{
  value: ToolDownloadDataset;
  label: string;
  description: string;
}> = [
  { value: 'BYP', label: 'BYP', description: 'Beneficiary Youth Programme questionnaire responses' },
  { value: 'IYP', label: 'IYP', description: 'Interest Youth Programme questionnaire responses' },
  { value: 'PC', label: 'PC', description: 'Parish Chief questionnaire responses' },
  { value: 'LGO', label: 'LGO', description: 'Local Government Official questionnaire responses' },
  {
    value: 'BUDGET_PRIORITIES',
    label: 'Budget Priorities',
    description: 'Public budget priority submissions by sector',
  },
  {
    value: 'LGO_BUDGET_ALLOCATION',
    label: 'Budget Allocations',
    description: 'LGO budget allocation interview responses',
  },
];

export interface ToolFieldDownloadFilter {
  districtId: string;
  subcountyId: string;
  parishId: string;
  gender: string;
  ageGroup: string;
  financialYearPeriod: string;
}

export function emptyToolFieldDownloadFilter(): ToolFieldDownloadFilter {
  return {
    districtId: '',
    subcountyId: '',
    parishId: '',
    gender: '',
    ageGroup: '',
    financialYearPeriod: '',
  };
}

export function isToolDownloadDataset(value: string | null | undefined): value is ToolDownloadDataset {
  return (
    typeof value === 'string' &&
    (TOOL_DOWNLOAD_DATASETS as readonly string[]).includes(value.trim().toUpperCase())
  );
}

export function parseToolDownloadDatasetParam(
  value: string | null | undefined
): ToolDownloadDataset | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  return isToolDownloadDataset(normalized) ? normalized : null;
}

export function toolDownloadDatasetLabel(dataset: ToolDownloadDataset): string {
  return TOOL_DOWNLOAD_DATASET_OPTIONS.find((option) => option.value === dataset)?.label ?? dataset;
}

export function buildToolFieldDownloadQueryString(filter: ToolFieldDownloadFilter): string {
  const params = new URLSearchParams();
  if (filter.districtId.trim()) params.set('districtId', filter.districtId.trim());
  if (filter.subcountyId.trim()) params.set('subcountyId', filter.subcountyId.trim());
  if (filter.parishId.trim()) params.set('parishId', filter.parishId.trim());
  if (filter.gender.trim()) params.set('gender', filter.gender.trim());
  if (filter.ageGroup.trim()) params.set('ageGroup', filter.ageGroup.trim());
  if (filter.financialYearPeriod.trim()) {
    params.set('financialYearPeriod', filter.financialYearPeriod.trim());
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function buildToolFieldDownloadFallbackFilename(
  dataset: ToolDownloadDataset,
  format: PublicExportFormat
): string {
  const extension = format === 'csv' ? 'csv' : 'xlsx';
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const slug = dataset.toLowerCase().replace(/_/g, '-');
  return `tool-field-data-${slug}-${timestamp}.${extension}`;
}

/** Recent FY period keys for hub filter dropdowns (no server round-trip). */
export function recentFinancialYearPeriodKeys(reference = new Date()): string[] {
  const year = reference.getFullYear();
  const keys: string[] = [];
  for (let y = year + 1; y >= year - 2; y -= 1) {
    keys.push(`JUL_DEC_${y}`, `JAN_JUN_${y}`);
  }
  return keys;
}

export function downloadHubPath(dataset?: ToolDownloadDataset | null): string {
  if (!dataset) {
    return '/download';
  }
  return `/download?dataset=${dataset}`;
}
