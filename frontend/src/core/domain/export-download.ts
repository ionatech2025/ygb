import type { DashboardFilter } from './dashboard-filter.model';
import { buildDashboardFilterQueryString } from './dashboard-filter.model';
import type { ExportFormat } from './export.model';
import type { PublicExportFormat } from './public-export.model';
import type { LgoBudgetAllocationDashboardFilter } from './lgo-budget-allocation-dashboard-filter.model';
import { buildLgoBudgetAllocationDashboardFilterQueryString } from './lgo-budget-allocation-dashboard-filter.model';

/** Short stable hash for export filenames when the server omits Content-Disposition. */
export function shortFilterHash(filter: DashboardFilter): string {
  const key = buildDashboardFilterQueryString(filter).replace(/^\?/, '') || 'all';
  let hash = 5381;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 33) ^ key.charCodeAt(index);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function buildExportFallbackFilename(format: ExportFormat, filter: DashboardFilter): string {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `ygb-export-${shortFilterHash(filter)}-${timestamp}.${format}`;
}

export function buildPublicExportFallbackFilename(format: PublicExportFormat): string {
  const extension = format === 'csv' ? 'csv' : 'xlsx';
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `ygb-public-export-${timestamp}.${extension}`;
}

export function buildBudgetPriorityExportFallbackFilename(
  format: PublicExportFormat,
  filter: { section?: string }
): string {
  const extension = format === 'csv' ? 'csv' : 'xlsx';
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const sectionPart = filter.section?.trim() ? filter.section : 'all-sectors';
  return `ygb-budget-priorities-${sectionPart}-${timestamp}.${extension}`;
}

function lgoBudgetAllocationExportFilterHint(filter: LgoBudgetAllocationDashboardFilter): string {
  if (filter.districtId.trim()) {
    return `district-${filter.districtId.slice(0, 8)}`;
  }
  if (filter.financialYearPeriod.trim()) {
    return filter.financialYearPeriod.toLowerCase().replace(/_/g, '-');
  }
  const query = buildLgoBudgetAllocationDashboardFilterQueryString(filter).replace(/^\?/, '');
  if (!query) {
    return 'all-filters';
  }
  let hash = 5381;
  for (let index = 0; index < query.length; index += 1) {
    hash = (hash * 33) ^ query.charCodeAt(index);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function buildLgoBudgetAllocationExportFallbackFilename(
  filter: LgoBudgetAllocationDashboardFilter
): string {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `ygb-lgo-budget-allocation-${lgoBudgetAllocationExportFilterHint(filter)}-${timestamp}.csv`;
}

export function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) {
    return null;
  }

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const quotedMatch = header.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = header.match(/filename=([^;]+)/i);
  return plainMatch?.[1]?.trim() ?? null;
}

export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.click();
  URL.revokeObjectURL(url);
}
