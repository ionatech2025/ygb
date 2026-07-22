import type { DashboardFilter } from './dashboard-filter.model';
import { buildDashboardFilterQueryString } from './dashboard-filter.model';
import type { ExportFormat } from './export.model';

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
