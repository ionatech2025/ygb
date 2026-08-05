import {
  isDownloadSessionShape,
  isDownloadSessionUsable,
  type DownloadSession,
} from '../../../core/domain/download-session.model';

export const DOWNLOAD_SESSION_STORAGE_KEY = 'ygb-download-session';

export function readDownloadSession(): DownloadSession | null {
  try {
    const raw = sessionStorage.getItem(DOWNLOAD_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isDownloadSessionShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDownloadSession(session: DownloadSession): void {
  sessionStorage.setItem(DOWNLOAD_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearDownloadSession(): void {
  sessionStorage.removeItem(DOWNLOAD_SESSION_STORAGE_KEY);
}

/** Returns a usable session, clearing storage when expired or corrupt. */
export function getUsableDownloadSession(now: Date = new Date()): DownloadSession | null {
  const session = readDownloadSession();
  if (!session) {
    return null;
  }
  if (!isDownloadSessionUsable(session, now)) {
    clearDownloadSession();
    return null;
  }
  return session;
}
