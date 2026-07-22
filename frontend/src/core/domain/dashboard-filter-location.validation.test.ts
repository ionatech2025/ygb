import { describe, expect, it, vi } from 'vitest';
import {
  isDashboardLocationFilterError,
  sanitizeDashboardLocationFilter,
  sanitizeDashboardLocationFilterFromApiOptions,
} from './dashboard-filter-location.validation';
import { EMPTY_DASHBOARD_FILTER } from './dashboard-filter.model';
import { KAMPALA_DISTRICT_ID, LEGACY_ARUA_DISTRICT_ID } from './location-seed.constants';
import type { ILocationRepositoryPort } from '../../ports/location-repository.port';

function createRepository(
  overrides: Partial<ILocationRepositoryPort> = {}
): ILocationRepositoryPort {
  return {
    save: vi.fn(),
    clear: vi.fn(),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockResolvedValue([{ id: 'd1', name: 'Arua', parentId: null, level: 'DISTRICT' }]),
    findByParentId: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe('dashboard-filter-location.validation', () => {
  it('detects backend location filter errors', () => {
    expect(isDashboardLocationFilterError('Location not found.')).toBe(true);
    expect(isDashboardLocationFilterError('Parish does not belong to the selected sub-county.')).toBe(true);
    expect(isDashboardLocationFilterError('Network unavailable')).toBe(false);
  });

  it('clears unknown district and dependent location filters', async () => {
    const repository = createRepository();

    const result = await sanitizeDashboardLocationFilter(
      {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: 'missing-district',
        subcountyId: 'sc1',
        parishId: 'p1',
      },
      repository
    );

    expect(result.wasSanitized).toBe(true);
    expect(result.filter.districtId).toBe('');
    expect(result.filter.subcountyId).toBe('');
    expect(result.filter.parishId).toBe('');
    expect(result.message).toContain('district');
  });

  it('clears invalid sub-county while keeping valid district', async () => {
    const repository = createRepository({
      findByParentId: vi.fn().mockResolvedValue([
        { id: 'sc1', name: 'Central', parentId: 'd1', level: 'SUBCOUNTY' },
      ]),
    });

    const result = await sanitizeDashboardLocationFilter(
      {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: 'd1',
        subcountyId: 'missing-subcounty',
        parishId: 'p1',
      },
      repository
    );

    expect(result.wasSanitized).toBe(true);
    expect(result.filter.districtId).toBe('d1');
    expect(result.filter.subcountyId).toBe('');
    expect(result.filter.parishId).toBe('');
  });

  it('clears legacy or stale district ids that are absent from dashboard filter options', () => {
    const result = sanitizeDashboardLocationFilterFromApiOptions(
      {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: LEGACY_ARUA_DISTRICT_ID,
      },
      {
        districts: [{ id: KAMPALA_DISTRICT_ID, name: 'Kampala' }],
        subcounties: [],
        parishes: [],
      }
    );

    expect(result.wasSanitized).toBe(true);
    expect(result.filter.districtId).toBe('');
  });
});
