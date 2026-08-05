import { describe, expect, it } from 'vitest';
import {
  isDownloadSessionUsable,
  type DownloadSession,
} from './download-session.model';

const session: DownloadSession = {
  profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  token: 'opaque-download-token',
  expiresAt: '2026-08-04T13:00:00',
};

describe('download-session.model', () => {
  it('treats session as usable before expiresAt', () => {
    expect(isDownloadSessionUsable(session, new Date('2026-08-04T12:59:59'))).toBe(true);
  });

  it('treats session as expired at or after expiresAt', () => {
    expect(isDownloadSessionUsable(session, new Date('2026-08-04T13:00:00'))).toBe(false);
    expect(isDownloadSessionUsable(session, new Date('2026-08-04T14:00:00'))).toBe(false);
  });

  it('rejects sessions with unparseable expiry', () => {
    expect(
      isDownloadSessionUsable({ ...session, expiresAt: 'not-a-date' }, new Date('2026-08-04T12:00:00'))
    ).toBe(false);
  });
});
