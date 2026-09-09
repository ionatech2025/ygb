import { API_BASE } from '../../../core/api/api-base';
import { ApiError } from '../../../core/api/api-client';
import {
  parseContentDispositionFilename,
  triggerBrowserDownload,
} from '../../../core/domain/export-download';
import type { PublicExportFormat } from '../../../core/domain/public-export.model';
import {
  buildToolFieldDownloadFallbackFilename,
  buildToolFieldDownloadQueryString,
  type ToolDownloadDataset,
  type ToolFieldDownloadFilter,
} from '../../../core/domain/tool-field-download.model';
import type { IAdminToolDownloadApiPort } from '../../../ports/admin-tool-download-api.port';

const FORMAT_PATH: Record<PublicExportFormat, string> = {
  csv: 'csv',
  xlsx: 'excel',
};

export function buildAdminToolDownloadUrl(
  dataset: ToolDownloadDataset,
  format: PublicExportFormat,
  filter: ToolFieldDownloadFilter
): string {
  const filterQuery = buildToolFieldDownloadQueryString(filter);
  return `${API_BASE}/api/v1/admin/downloads/${dataset}/${FORMAT_PATH[format]}${filterQuery}`;
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

export class HttpAdminToolDownloadAdapter implements IAdminToolDownloadApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async downloadToolDataset(
    dataset: ToolDownloadDataset,
    format: PublicExportFormat,
    filter: ToolFieldDownloadFilter
  ): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const response = await fetch(buildAdminToolDownloadUrl(dataset, format, filter), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(readExportErrorMessage(text, response.statusText), response.status);
    }

    const blob = await response.blob();
    const filename =
      parseContentDispositionFilename(response.headers.get('Content-Disposition')) ??
      buildToolFieldDownloadFallbackFilename(dataset, format);

    triggerBrowserDownload(blob, filename);
  }
}
