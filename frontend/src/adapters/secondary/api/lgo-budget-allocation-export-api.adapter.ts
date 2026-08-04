import { API_BASE } from '../../../core/api/api-base';
import { ApiError } from '../../../core/api/api-client';
import { buildDownloadSessionHeaders } from '../../../core/domain/download-session-headers';
import { buildLgoBudgetAllocationDashboardFilterQueryString } from '../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import type { LgoBudgetAllocationDashboardFilter } from '../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import {
  buildLgoBudgetAllocationExportFallbackFilename,
  parseContentDispositionFilename,
  triggerBrowserDownload,
} from '../../../core/domain/export-download';
import type { ILgoBudgetAllocationExportApiPort } from '../../../ports/lgo-budget-allocation-export-api.port';

export const LGO_BUDGET_ALLOCATION_EXPORT_CSV_PATH =
  '/api/v1/public/dashboard/lgo-budget-allocation/download/csv';

export function buildLgoBudgetAllocationExportUrl(filter: LgoBudgetAllocationDashboardFilter): string {
  const filterQuery = buildLgoBudgetAllocationDashboardFilterQueryString(filter).replace(/^\?/, '');
  const suffix = filterQuery ? `?${filterQuery}` : '';
  return `${API_BASE}${LGO_BUDGET_ALLOCATION_EXPORT_CSV_PATH}${suffix}`;
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

export class HttpLgoBudgetAllocationExportAdapter implements ILgoBudgetAllocationExportApiPort {
  async downloadCsv(filter: LgoBudgetAllocationDashboardFilter, sessionToken: string): Promise<void> {
    const response = await fetch(buildLgoBudgetAllocationExportUrl(filter), {
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
      buildLgoBudgetAllocationExportFallbackFilename(filter);

    triggerBrowserDownload(blob, filename);
  }
}
