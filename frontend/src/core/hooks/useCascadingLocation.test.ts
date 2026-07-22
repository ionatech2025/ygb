import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AdminLocation } from '../domain/admin-location.model';
import type { LocationFields } from '../domain/admin-location.model';
import type { ILocationRepositoryPort } from '../../ports/location-repository.port';
import { useCascadingLocation } from './useCascadingLocation';

vi.mock('../LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    getLoadError: vi.fn().mockReturnValue(null),
  },
}));

const district: AdminLocation = {
  id: 'district-1',
  name: 'Kampala',
  parentId: null,
  level: 'DISTRICT',
};

const subcounty: AdminLocation = {
  id: 'subcounty-1',
  name: 'Central Division',
  parentId: district.id,
  level: 'SUBCOUNTY',
};

function createRepository(): ILocationRepositoryPort {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level) => (level === 'DISTRICT' ? [district] : [])),
    findByParentId: vi.fn().mockImplementation(async (parentId) => {
      if (parentId === district.id) return [subcounty];
      return [];
    }),
  };
}

describe('useCascadingLocation', () => {
  it('clears sub-county, parish, and village when district changes (TC-FORM-07-03)', async () => {
    const repository = createRepository();
    const onChange = vi.fn();

    const initial: LocationFields = {
      districtId: district.id,
      subcountyId: subcounty.id,
      parishId: 'parish-1',
      villageId: 'village-1',
    };

    const { result } = renderHook(() => useCascadingLocation(initial, onChange, { repository }));

    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => {
      result.current.setDistrict('district-2');
    });

    expect(onChange).toHaveBeenCalledWith({
      districtId: 'district-2',
      subcountyId: '',
      parishId: '',
      villageId: '',
    });
  });

  it('loads sub-counties only for the selected district (TC-FORM-07-02)', async () => {
    const repository = createRepository();
    const onChange = vi.fn();
    const initial: LocationFields = {
      districtId: district.id,
      subcountyId: '',
      parishId: '',
      villageId: '',
    };

    const { result } = renderHook(() => useCascadingLocation(initial, onChange, { repository }));

    await waitFor(() => expect(result.current.subcounties).toEqual([subcounty]));

    act(() => {
      result.current.setSubcounty(subcounty.id);
    });

    expect(onChange).toHaveBeenCalledWith({
      districtId: district.id,
      subcountyId: subcounty.id,
      parishId: '',
      villageId: '',
    });
  });
});
