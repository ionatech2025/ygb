import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_COLLECTOR_PROFILE_FILTER } from '../../../core/domain/collector-profile-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../core/domain/location-seed.constants';
import { HttpUserAdapter } from './http-user.adapter';

describe('http-user.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes the Authorization header when deactivating a user', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'user-1',
          name: 'Jane Doe',
          phoneNumber: '0771234567',
          role: 'DATA_COLLECTOR',
          isActive: false,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpUserAdapter(() => 'admin-token');
    await adapter.deactivateUser('user-1');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/users/user-1/deactivate'),
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.any(Headers),
      })
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
  });

  it('includes the Authorization header when resetting a password', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ temporaryPassword: 'TempPass1234' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpUserAdapter(() => 'admin-token');
    const result = await adapter.resetPassword('user-1');

    expect(result.temporaryPassword).toBe('TempPass1234');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/users/user-1/reset-password');
  });

  it('includes filter query params when loading collector submissions', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          totalElements: 0,
          page: 0,
          size: 25,
          totalPages: 0,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpUserAdapter(() => 'admin-token');
    await adapter.getCollectorSubmissions(
      'user-1',
      { ...EMPTY_COLLECTOR_PROFILE_FILTER, districtId: KAMPALA_DISTRICT_ID, formType: 'BYP' },
      0
    );

    expect(fetchMock.mock.calls[0]?.[0]).toContain(`/api/v1/admin/users/user-1/submissions?`);
    expect(fetchMock.mock.calls[0]?.[0]).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(fetchMock.mock.calls[0]?.[0]).toContain('formType=BYP');
  });
});
