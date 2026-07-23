import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../core/domain/public-dashboard-filter.model';
import {
  assertPublicExportHeaders,
  PUBLIC_EXPORT_ALLOWED_HEADERS,
} from '../../../core/domain/public-export.model';
import { KAMPALA_DISTRICT_ID } from '../../../core/domain/location-seed.constants';
import {
  buildPublicExportUrl,
  HttpPublicExportAdapter,
} from './public-export-api.adapter';

describe('public-export-api.adapter', () => {
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

  it('builds export URL with active filter query params', () => {
    const url = buildPublicExportUrl('csv', {
      ...EMPTY_PUBLIC_DASHBOARD_FILTER,
      districtId: KAMPALA_DISTRICT_ID,
      gender: 'FEMALE',
    });

    expect(url).toContain('/api/v1/public/dashboard/download/csv');
    expect(url).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(url).toContain('gender=FEMALE');
  });

  it('requests export without an auth header and triggers browser download', async () => {
    const headerLine = PUBLIC_EXPORT_ALLOWED_HEADERS.join(',');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(`${headerLine}\n1,BYP`, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="public-dataset-export-20260315.csv"',
        },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpPublicExportAdapter();
    await adapter.downloadExport('csv', { ...EMPTY_PUBLIC_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/public/dashboard/download/csv');
    expect(url).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(init.headers).toBeUndefined();

    expect(click).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
  });

  it('uses Content-Disposition filename for the downloaded file', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="public-dataset-export-20260315.xlsx"',
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

    const adapter = new HttpPublicExportAdapter();
    await adapter.downloadExport('xlsx', EMPTY_PUBLIC_DASHBOARD_FILTER);

    expect(capturedDownload).toBe('public-dataset-export-20260315.xlsx');
  });

  it('validates anonymised CSV headers contain no PII columns (TC-PUB-04-04)', () => {
    const headerLine = PUBLIC_EXPORT_ALLOWED_HEADERS.join(',');
    expect(() => assertPublicExportHeaders(headerLine)).not.toThrow();
    expect(() => assertPublicExportHeaders('ID,Respondent Name,Phone Number')).toThrow(/forbidden PII header/i);
  });
});
