import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchAdminActiveFiscalYear,
  fetchPublicActiveFiscalYear,
  setAdminActiveFiscalYear,
} from './fiscal-year-settings-api.adapter';

describe('fiscal-year-settings-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the public active fiscal year setting', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          fiscalYearLabel: '2025/26',
          priorFiscalYearLabel: '2024/25',
          supportedLabels: ['2025/26', '2024/25'],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const setting = await fetchPublicActiveFiscalYear();

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/public/settings/fiscal-year');
    expect(setting.fiscalYearLabel).toBe('2025/26');
    expect(setting.priorFiscalYearLabel).toBe('2024/25');
  });

  it('includes Authorization when fetching admin fiscal year settings', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          fiscalYearLabel: '2025/26',
          priorFiscalYearLabel: '2024/25',
          supportedLabels: ['2025/26', '2024/25'],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    await fetchAdminActiveFiscalYear('admin-token');

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/settings/fiscal-year');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
  });

  it('PUTs the selected fiscal year label for admin updates', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          fiscalYearLabel: '2024/25',
          priorFiscalYearLabel: '2023/24',
          supportedLabels: ['2025/26', '2024/25'],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const updated = await setAdminActiveFiscalYear('2024/25', 'admin-token');

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/settings/fiscal-year');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('PUT');
    expect(init.body).toBe(JSON.stringify({ fiscalYearLabel: '2024/25' }));
    expect(updated.fiscalYearLabel).toBe('2024/25');
  });
});
