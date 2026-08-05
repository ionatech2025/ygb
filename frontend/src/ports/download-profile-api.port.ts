import type { RegisterDownloadProfileRequest } from '../core/domain/download-profile.model';
import type { DownloadSession } from '../core/domain/download-session.model';

export interface IDownloadProfileApiPort {
  registerProfile(request: RegisterDownloadProfileRequest): Promise<DownloadSession>;
}
