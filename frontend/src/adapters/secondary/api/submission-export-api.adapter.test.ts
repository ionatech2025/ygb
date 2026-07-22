import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DASHBOARD_FILTER } from '../../../core/domain/dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../core/domain/location-seed.constants';
import { HttpSubmissionExportAdapter } from './submission-export-api.adapter';

describe('submission-export-api.adapter', () => {
  const createObjectURL = vi.fn(() => 'blob:export');
  const revokeObjectURL = vi.fn();
  const click = vi.fn();
  const originalCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    vi.restoreAllMocks();
    createObjectURL.mockReturnValue('blob:export');
    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    });

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'a') {
        return { click, download: '', href: '', rel: '' } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tagName);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('requests export with auth header and active filter query params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('id,formType\n1,BYP', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="submissions-export-20260315.csv"',
        },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpSubmissionExportAdapter(() => 'admin-token');
    await adapter.downloadExport('csv', { ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/submissions/export?'),
      expect.objectContaining({
        headers: expect.any(Object),
      })
    );

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(url).toContain('format=csv');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer admin-token');

    expect(click).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
  });

  it('uses Content-Disposition filename for the downloaded file', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="submissions-export-20260315.xlsx"',
        },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    let capturedDownload = '';
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'a') {
        const element = {
          click,
          href: '',
          rel: '',
        } as unknown as HTMLAnchorElement;
        Object.defineProperty(element, 'download', {
          set(value: string) {
            capturedDownload = value;
          },
          get() {
            return capturedDownload;
          },
        });
        return element;
      }
      return originalCreateElement(tagName);
    });

    const adapter = new HttpSubmissionExportAdapter(() => 'admin-token');
    await adapter.downloadExport('xlsx', EMPTY_DASHBOARD_FILTER);

    expect(capturedDownload).toBe('submissions-export-20260315.xlsx');
  });
});
