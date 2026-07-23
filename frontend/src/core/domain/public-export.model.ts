export type PublicExportFormat = 'csv' | 'xlsx';

export const PUBLIC_EXPORT_FORMAT_LABELS: Record<PublicExportFormat, string> = {
  csv: 'Download CSV',
  xlsx: 'Download Excel',
};

/** Whitelisted anonymised export columns (mirrors backend PublicAnonymisedRecord.EXPORT_HEADERS). */
export const PUBLIC_EXPORT_ALLOWED_HEADERS = [
  'ID',
  'Form Type',
  'District ID',
  'District',
  'Gender',
  'Age Group',
  'Form Completed At',
  'Status',
  'Financial Year Period',
] as const;

export const PUBLIC_EXPORT_FORBIDDEN_HEADER_PATTERNS = [
  /phone/i,
  /name/i,
  /collector/i,
  /respondent/i,
  /email/i,
] as const;

export function assertPublicExportHeaders(headerLine: string): void {
  const headers = headerLine.split(',').map((value) => value.trim());
  for (const pattern of PUBLIC_EXPORT_FORBIDDEN_HEADER_PATTERNS) {
    if (headers.some((header) => pattern.test(header))) {
      throw new Error(`Export contains forbidden PII header matching ${pattern}`);
    }
  }
  for (const allowed of PUBLIC_EXPORT_ALLOWED_HEADERS) {
    if (!headers.includes(allowed)) {
      throw new Error(`Export is missing expected anonymised header: ${allowed}`);
    }
  }
}
