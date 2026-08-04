import { apiFetch } from '../../../core/api/api-client';
import type { RegisterDownloadProfileRequest } from '../../../core/domain/download-profile.model';
import type { DownloadSession } from '../../../core/domain/download-session.model';
import { isDownloadSessionShape } from '../../../core/domain/download-session.model';
import type { IDownloadProfileApiPort } from '../../../ports/download-profile-api.port';

export class HttpDownloadProfileAdapter implements IDownloadProfileApiPort {
  async registerProfile(request: RegisterDownloadProfileRequest): Promise<DownloadSession> {
    const response = await apiFetch<unknown>('/api/v1/public/download-profile', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!isDownloadSessionShape(response)) {
      throw new Error('Download profile registration returned an unexpected response.');
    }

    return response;
  }
}
