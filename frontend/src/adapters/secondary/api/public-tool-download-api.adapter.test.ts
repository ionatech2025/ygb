import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ApiError } from '../../../core/api/api-client';
import { emptyToolFieldDownloadFilter } from '../../../core/domain/tool-field-download.model';
import {
  buildPublicToolDownloadUrl,
  HttpPublicToolDownloadAdapter,
} from './public-tool-download-api.adapter';

describe('HttpPublicToolDownloadAdapter', () => {
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

  it('builds hub download URLs with dataset path and filters', () => {
    expect(
      buildPublicToolDownloadUrl('BYP', 'csv', {
        ...emptyToolFieldDownloadFilter(),
        districtId: 'd1',
      })
    ).toContain('/api/v1/public/downloads/BYP/csv?districtId=d1');
    expect(
      buildPublicToolDownloadUrl('LGO_BUDGET_ALLOCATION', 'xlsx', emptyToolFieldDownloadFilter())
    ).toContain('/api/v1/public/downloads/LGO_BUDGET_ALLOCATION/excel');
  });

  it('sends download session header and triggers browser download', async () => {
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

    const adapter = new HttpPublicToolDownloadAdapter();
    await adapter.downloadToolDataset('BYP', 'csv', emptyToolFieldDownloadFilter(), 'session-1');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/public/downloads/BYP/csv'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Download-Session': 'session-1' }),
      })
    );
    expect(click).toHaveBeenCalled();
  });

  it('maps failed responses to ApiError', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify({ message: 'Download session required' }),
    });

    const adapter = new HttpPublicToolDownloadAdapter();
    await expect(
      adapter.downloadToolDataset('IYP', 'csv', emptyToolFieldDownloadFilter(), 'bad')
    ).rejects.toBeInstanceOf(ApiError);
  });
});
