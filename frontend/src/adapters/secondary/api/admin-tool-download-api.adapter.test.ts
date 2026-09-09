import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ApiError } from '../../../core/api/api-client';
import { emptyToolFieldDownloadFilter } from '../../../core/domain/tool-field-download.model';
import {
  buildAdminToolDownloadUrl,
  HttpAdminToolDownloadAdapter,
} from './admin-tool-download-api.adapter';

describe('HttpAdminToolDownloadAdapter', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal(
      'URL',
      class {
        static createObjectURL = vi.fn(() => 'blob:mock');
        static revokeObjectURL = vi.fn();
      }
    );
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllGlobals();
  });

  it('builds admin hub download URLs with dataset path and filters', () => {
    expect(
      buildAdminToolDownloadUrl('BYP', 'csv', {
        ...emptyToolFieldDownloadFilter(),
        districtId: 'd1',
      })
    ).toContain('/api/v1/admin/downloads/BYP/csv?districtId=d1');
    expect(
      buildAdminToolDownloadUrl('BUDGET_PRIORITIES', 'xlsx', emptyToolFieldDownloadFilter())
    ).toContain('/api/v1/admin/downloads/BUDGET_PRIORITIES/excel');
  });

  it('sends Bearer token and triggers browser download', async () => {
    const blob = new Blob(['Dataset,District\nBYP,Kampala\n'], { type: 'text/csv' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => blob,
      headers: {
        get: (name: string) =>
          name === 'Content-Disposition' ? 'attachment; filename="byp.csv"' : null,
      },
    });
    const click = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(_v: string) {},
      set download(_v: string) {},
      set rel(_v: string) {},
    } as unknown as HTMLAnchorElement);

    const adapter = new HttpAdminToolDownloadAdapter(() => 'admin-jwt');
    await adapter.downloadToolDataset('BYP', 'csv', emptyToolFieldDownloadFilter());

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/downloads/BYP/csv'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer admin-jwt' }),
      })
    );
    expect(click).toHaveBeenCalled();
  });

  it('rejects when no access token is available', async () => {
    const adapter = new HttpAdminToolDownloadAdapter(() => null);
    await expect(
      adapter.downloadToolDataset('IYP', 'csv', emptyToolFieldDownloadFilter())
    ).rejects.toThrow(/administrator/i);
  });

  it('maps failed responses to ApiError', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: async () => JSON.stringify({ message: 'Forbidden' }),
    });

    const adapter = new HttpAdminToolDownloadAdapter(() => 'admin-jwt');
    await expect(
      adapter.downloadToolDataset('PC', 'xlsx', emptyToolFieldDownloadFilter())
    ).rejects.toBeInstanceOf(ApiError);
  });
});
