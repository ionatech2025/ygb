import { API_BASE } from '../../../core/api/api-base';
import { ApiError } from '../../../core/api/api-client';
import { buildDownloadSessionHeaders } from '../../../core/domain/download-session-headers';
import { buildBudgetPriorityDashboardFilterQueryString } from '../../../core/domain/budget-priority-dashboard-filter.model';
import type { BudgetPriorityDashboardFilter } from '../../../core/domain/budget-priority-dashboard-filter.model';
import {
  buildBudgetPriorityExportFallbackFilename,
  parseContentDispositionFilename,
  triggerBrowserDownload,
} from '../../../core/domain/export-download';
import type { PublicExportFormat } from '../../../core/domain/public-export.model';
import type { IBudgetPriorityExportApiPort } from '../../../ports/budget-priority-export-api.port';

const EXPORT_PATHS: Record<PublicExportFormat, string> = {
  csv: '/api/v1/public/dashboard/budget-priorities/download/csv',
  xlsx: '/api/v1/public/dashboard/budget-priorities/download/excel',
};

export function buildBudgetPriorityExportUrl(
  format: PublicExportFormat,
  filter: BudgetPriorityDashboardFilter
): string {
  const filterQuery = buildBudgetPriorityDashboardFilterQueryString(filter).replace(/^\?/, '');
  const suffix = filterQuery ? `?${filterQuery}` : '';
  return `${API_BASE}${EXPORT_PATHS[format]}${suffix}`;
}

function readExportErrorMessage(text: string, fallback: string): string {
  let message = text || fallback;
  try {
    const json = JSON.parse(text) as { message?: string; detail?: string };
    if (json.detail) message = json.detail;
    else if (json.message) message = json.message;
  } catch {
    // plain-text error body
  }
  return message;
}

export class HttpBudgetPriorityExportAdapter implements IBudgetPriorityExportApiPort {
  async downloadExport(
    format: PublicExportFormat,
    filter: BudgetPriorityDashboardFilter,
    sessionToken: string
  ): Promise<void> {
    const response = await fetch(buildBudgetPriorityExportUrl(format, filter), {
      method: 'GET',
      headers: buildDownloadSessionHeaders(sessionToken),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(readExportErrorMessage(text, response.statusText), response.status);
    }

    const blob = await response.blob();
    const filename =
      parseContentDispositionFilename(response.headers.get('Content-Disposition')) ??
      buildBudgetPriorityExportFallbackFilename(format, filter);

    triggerBrowserDownload(blob, filename);
  }
}
