import { beforeEach, describe, expect, it } from 'vitest';
import type { DownloadSession } from '../../../core/domain/download-session.model';
import {
  clearDownloadSession,
  getUsableDownloadSession,
  readDownloadSession,
  writeDownloadSession,
} from './download-session.store';

const session: DownloadSession = {
  profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  token: 'opaque-download-token',
  expiresAt: '2026-08-04T13:00:00',
};

describe('download-session.store', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('persists and reads a download session from sessionStorage', () => {
    writeDownloadSession(session);
    expect(readDownloadSession()).toEqual(session);
  });

  it('clears the stored session', () => {
    writeDownloadSession(session);
    clearDownloadSession();
    expect(readDownloadSession()).toBeNull();
  });

  it('returns usable session before expiry and clears when expired', () => {
    writeDownloadSession(session);

    expect(getUsableDownloadSession(new Date('2026-08-04T12:00:00'))).toEqual(session);
    expect(readDownloadSession()).toEqual(session);

    expect(getUsableDownloadSession(new Date('2026-08-04T13:00:00'))).toBeNull();
    expect(readDownloadSession()).toBeNull();
  });

  it('ignores corrupt sessionStorage payloads', () => {
    sessionStorage.setItem('ygb-download-session', '{not-json');
    expect(readDownloadSession()).toBeNull();

    sessionStorage.setItem('ygb-download-session', JSON.stringify({ token: 'only-token' }));
    expect(readDownloadSession()).toBeNull();
  });
});
