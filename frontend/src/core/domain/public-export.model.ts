/** Shared CSV/Excel format labels for public and admin field-data download hubs. */
export type PublicExportFormat = 'csv' | 'xlsx';

export const PUBLIC_EXPORT_FORMAT_LABELS: Record<PublicExportFormat, string> = {
  csv: 'Download CSV',
  xlsx: 'Download Excel',
};
