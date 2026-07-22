import { API_BASE } from '../../../core/api/api-base';
import { ApiError } from '../../../core/api/api-client';
import { buildDashboardFilterQueryString } from '../../../core/domain/dashboard-filter.model';
import type { DashboardFilter } from '../../../core/domain/dashboard-filter.model';
import {
  buildExportFallbackFilename,
  parseContentDispositionFilename,
  triggerBrowserDownload,
} from '../../../core/domain/export-download';
import type { ExportFormat } from '../../../core/domain/export.model';
import type { ISubmissionExportApiPort } from '../../../ports/submission-export-api.port';

export class HttpSubmissionExportAdapter implements ISubmissionExportApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async downloadExport(format: ExportFormat, filter: DashboardFilter): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const filterQuery = buildDashboardFilterQueryString(filter).replace(/^\?/, '');
    const params = new URLSearchParams(filterQuery);
    params.set('format', format);

    const response = await fetch(`${API_BASE}/api/v1/admin/submissions/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      buildExportFallbackFilename(format, filter);

    triggerBrowserDownload(blob, filename);
  }
}
