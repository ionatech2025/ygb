import { describe, expect, it } from 'vitest';
import {
  buildExportFallbackFilename,
  parseContentDispositionFilename,
  shortFilterHash,
} from './export-download';
import { EMPTY_DASHBOARD_FILTER } from './dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from './location-seed.constants';

describe('export download helpers', () => {
  it('parses filename from Content-Disposition', () => {
    expect(parseContentDispositionFilename('attachment; filename="submissions-export-20260315.csv"')).toBe(
      'submissions-export-20260315.csv'
    );
  });

  it('builds fallback filename with filter hash prefix', () => {
    const filename = buildExportFallbackFilename('csv', {
      ...EMPTY_DASHBOARD_FILTER,
      districtId: KAMPALA_DISTRICT_ID,
    });

    expect(filename).toMatch(/^ygb-export-[0-9a-f]{8}-\d{14}\.csv$/);
    expect(shortFilterHash({ ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID })).not.toBe(
      shortFilterHash(EMPTY_DASHBOARD_FILTER)
    );
  });
});
