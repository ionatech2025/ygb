import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER } from '../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../core/domain/location-seed.constants';
import {
  buildLgoBudgetAllocationExportUrl,
  HttpLgoBudgetAllocationExportAdapter,
  LGO_BUDGET_ALLOCATION_EXPORT_CSV_PATH,
} from './lgo-budget-allocation-export-api.adapter';

describe('lgo-budget-allocation-export-api.adapter', () => {
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
    const url = buildLgoBudgetAllocationExportUrl({
      ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
      districtId: KAMPALA_DISTRICT_ID,
      gender: 'FEMALE',
      financialYearPeriod: 'JAN_JUN_2026',
    });

    expect(url).toContain(LGO_BUDGET_ALLOCATION_EXPORT_CSV_PATH);
    expect(url).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(url).toContain('gender=FEMALE');
    expect(url).toContain('financialYearPeriod=JAN_JUN_2026');
  });

  it('requests export without an auth header and triggers browser download', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('id,district,count\n1,Kampala,1', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="ygb-lgo-budget-allocation-20260723.csv"',
        },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpLgoBudgetAllocationExportAdapter();
    await adapter.downloadCsv({
      ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
      districtId: KAMPALA_DISTRICT_ID,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(LGO_BUDGET_ALLOCATION_EXPORT_CSV_PATH);
    expect(url).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
    expect(init.headers).toBeUndefined();

    expect(click).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
  });

  it('uses Content-Disposition filename for the downloaded file', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('id,district,count\n1,Kampala,1', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="ygb-lgo-budget-allocation-20260723.csv"',
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

    const adapter = new HttpLgoBudgetAllocationExportAdapter();
    await adapter.downloadCsv(EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER);

    expect(capturedDownload).toBe('ygb-lgo-budget-allocation-20260723.csv');
  });
});
