import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PersistentAuthAdapter } from './persistent-auth.adapter';
import { apiFetch } from '../../../core/api/api-client';

vi.mock('../../../core/api/api-client', () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      message: string,
      readonly status: number
    ) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

const apiFetchMock = vi.mocked(apiFetch);

const COLLECTOR_ID = '22222222-2222-2222-2222-222222222222';
const TEST_TOKEN =
  'eyJhbGciOiJub25lIn0.' +
  btoa(JSON.stringify({ sub: COLLECTOR_ID, role: 'DATA_COLLECTOR', exp: 4_102_444_800 }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '') +
  '.signature';

describe('PersistentAuthAdapter', () => {
  const adapter = new PersistentAuthAdapter();

  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it('loginOnline maps API user.fullName into AuthResponse.user', async () => {
    apiFetchMock.mockResolvedValue({
      token: TEST_TOKEN,
      user: {
        id: COLLECTOR_ID,
        fullName: 'Default Collector',
        phoneNumber: '0771111111',
        role: 'DATA_COLLECTOR',
      },
    });

    const result = await adapter.loginOnline({
      phoneNumber: '0771111111',
      passwordPlain: 'password',
    });

    expect(result.user.fullName).toBe('Default Collector');
    expect(result.user.phoneNumber).toBe('0771111111');
    expect(result.user.role).toBe('DATA_COLLECTOR');
    expect(result.tokens.accessToken).toBe(TEST_TOKEN);
  });

  it('loginOffline returns cached fullName from prior online login', async () => {
    apiFetchMock.mockResolvedValue({
      token: TEST_TOKEN,
      user: {
        id: COLLECTOR_ID,
        fullName: 'Jane Nakato',
        phoneNumber: '0771111111',
        role: 'DATA_COLLECTOR',
      },
    });

    await adapter.loginOnline({
      phoneNumber: '0771111111',
      passwordPlain: 'password',
    });
    await adapter.cacheCredentials(
      {
        id: COLLECTOR_ID,
        fullName: 'Jane Nakato',
        phoneNumber: '0771111111',
        role: 'DATA_COLLECTOR',
      },
      'password',
      {
        accessToken: TEST_TOKEN,
        refreshToken: '',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 60_000,
      }
    );

    const offlineUser = await adapter.loginOffline({
      phoneNumber: '0771111111',
      passwordPlain: 'password',
    });

    expect(offlineUser.fullName).toBe('Jane Nakato');
    expect(offlineUser.fullName).not.toBe('Field Collector');
  });
});
