export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: 'Export CSV',
  xlsx: 'Export Excel',
  pdf: 'Generate PDF report',
};

export interface ExportDownloadResult {
  blob: Blob;
  filename: string;
}
