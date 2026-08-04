import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearCachedPublicActiveFiscalYear,
  fetchAdminActiveFiscalYear,
  fetchPublicActiveFiscalYear,
  readCachedPublicActiveFiscalYear,
  setAdminActiveFiscalYear,
} from './fiscal-year-settings-api.adapter';

const SETTING = {
  fiscalYearLabel: '2025/26',
  priorFiscalYearLabel: '2024/25',
  supportedLabels: ['2025/26', '2024/25'],
};

function stubJsonFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fiscal-year-settings-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearCachedPublicActiveFiscalYear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearCachedPublicActiveFiscalYear();
  });

  it('fetches the public active fiscal year setting', async () => {
    const fetchMock = stubJsonFetch(SETTING);

    const setting = await fetchPublicActiveFiscalYear();

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/public/settings/fiscal-year');
    expect(setting.fiscalYearLabel).toBe('2025/26');
    expect(setting.priorFiscalYearLabel).toBe('2024/25');
  });

  it('persists a successful public fiscal year response for later reads', async () => {
    stubJsonFetch(SETTING);

    await fetchPublicActiveFiscalYear();

    expect(readCachedPublicActiveFiscalYear()).toEqual(SETTING);
  });

  it('returns the cached setting when the network request fails', async () => {
    stubJsonFetch(SETTING);
    await fetchPublicActiveFiscalYear();

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const setting = await fetchPublicActiveFiscalYear();

    expect(setting).toEqual(SETTING);
  });

  it('propagates the network error when cache is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchPublicActiveFiscalYear()).rejects.toThrow(/Failed to fetch/i);
    expect(readCachedPublicActiveFiscalYear()).toBeNull();
  });

  it('includes Authorization when fetching admin fiscal year settings', async () => {
    const fetchMock = stubJsonFetch(SETTING);

    await fetchAdminActiveFiscalYear('admin-token');

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/settings/fiscal-year');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
  });

  it('PUTs the selected fiscal year label for admin updates', async () => {
    const fetchMock = stubJsonFetch({
      fiscalYearLabel: '2024/25',
      priorFiscalYearLabel: '2023/24',
      supportedLabels: ['2025/26', '2024/25'],
    });

    const updated = await setAdminActiveFiscalYear('2024/25', 'admin-token');

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/settings/fiscal-year');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('PUT');
    expect(init.body).toBe(JSON.stringify({ fiscalYearLabel: '2024/25' }));
    expect(updated.fiscalYearLabel).toBe('2024/25');
  });
});
