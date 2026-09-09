import { API_BASE } from '../../../core/api/api-base';
import { ApiError } from '../../../core/api/api-client';
import { buildDownloadSessionHeaders } from '../../../core/domain/download-session-headers';
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
import type { IPublicToolDownloadApiPort } from '../../../ports/public-tool-download-api.port';

const FORMAT_PATH: Record<PublicExportFormat, string> = {
  csv: 'csv',
  xlsx: 'excel',
};

export function buildPublicToolDownloadUrl(
  dataset: ToolDownloadDataset,
  format: PublicExportFormat,
  filter: ToolFieldDownloadFilter
): string {
  const filterQuery = buildToolFieldDownloadQueryString(filter);
  return `${API_BASE}/api/v1/public/downloads/${dataset}/${FORMAT_PATH[format]}${filterQuery}`;
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

export class HttpPublicToolDownloadAdapter implements IPublicToolDownloadApiPort {
  async downloadToolDataset(
    dataset: ToolDownloadDataset,
    format: PublicExportFormat,
    filter: ToolFieldDownloadFilter,
    sessionToken: string
  ): Promise<void> {
    const response = await fetch(buildPublicToolDownloadUrl(dataset, format, filter), {
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
      buildToolFieldDownloadFallbackFilename(dataset, format);

    triggerBrowserDownload(blob, filename);
  }
}
