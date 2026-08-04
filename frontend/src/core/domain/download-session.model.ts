export interface DownloadSession {
  profileId: string;
  token: string;
  /** Server LocalDateTime serialized as ISO-8601 without offset, e.g. 2026-08-04T13:00:00 */
  expiresAt: string;
}

/**
 * A session is usable strictly before expiresAt.
 * Datetimes without a zone are parsed as local time (browser Date behaviour).
 */
export function isDownloadSessionUsable(session: DownloadSession, now: Date): boolean {
  const expiresMs = Date.parse(session.expiresAt);
  if (!Number.isFinite(expiresMs)) {
    return false;
  }
  return expiresMs > now.getTime();
}

export function isDownloadSessionShape(value: unknown): value is DownloadSession {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.profileId === 'string' &&
    candidate.profileId.length > 0 &&
    typeof candidate.token === 'string' &&
    candidate.token.length > 0 &&
    typeof candidate.expiresAt === 'string' &&
    candidate.expiresAt.length > 0
  );
}
