import { API_BASE } from '../../../core/api/api-base';
import { ApiError } from '../../../core/api/api-client';
import { buildPublicDashboardFilterQueryString } from '../../../core/domain/public-dashboard-filter.model';
import type { PublicDashboardFilter } from '../../../core/domain/public-dashboard-filter.model';
import {
  buildPublicExportFallbackFilename,
  parseContentDispositionFilename,
  triggerBrowserDownload,
} from '../../../core/domain/export-download';
import type { PublicExportFormat } from '../../../core/domain/public-export.model';
import type { IPublicExportApiPort } from '../../../ports/public-export-api.port';

const EXPORT_PATHS: Record<PublicExportFormat, string> = {
  csv: '/api/v1/public/dashboard/download/csv',
  xlsx: '/api/v1/public/dashboard/download/excel',
};

export function buildPublicExportUrl(format: PublicExportFormat, filter: PublicDashboardFilter): string {
  const filterQuery = buildPublicDashboardFilterQueryString(filter).replace(/^\?/, '');
  const suffix = filterQuery ? `?${filterQuery}` : '';
  return `${API_BASE}${EXPORT_PATHS[format]}${suffix}`;
}

export class HttpPublicExportAdapter implements IPublicExportApiPort {
  async downloadExport(format: PublicExportFormat, filter: PublicDashboardFilter): Promise<void> {
    const response = await fetch(buildPublicExportUrl(format, filter), {
      method: 'GET',
    });

    if (!response.ok) {
      const text = await response.text();
      let message = text || response.statusText;
      try {
        const json = JSON.parse(text) as { message?: string };
        if (json.message) {
          message = json.message;
        }
      } catch {
        // plain-text error body
      }
      throw new ApiError(message, response.status);
    }

    const blob = await response.blob();
    const filename =
      parseContentDispositionFilename(response.headers.get('Content-Disposition')) ??
      buildPublicExportFallbackFilename(format);

    triggerBrowserDownload(blob, filename);
  }
}
