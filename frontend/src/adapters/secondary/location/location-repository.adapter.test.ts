import { beforeEach, describe, expect, it } from 'vitest';
import type { AdminLocation } from '../../../core/domain/admin-location.model';
import { locationRepository, locationDb } from './location-repository.adapter';

const SAMPLE: AdminLocation[] = [
  { id: 'district-1', name: 'Kampala', parentId: null, level: 'DISTRICT' },
  { id: 'subcounty-1', name: 'Central Division', parentId: 'district-1', level: 'SUBCOUNTY' },
  { id: 'parish-1', name: 'Kisenyi I', parentId: 'subcounty-1', level: 'PARISH' },
  { id: 'village-1', name: 'Kakajjo Zone', parentId: 'parish-1', level: 'VILLAGE' },
];

describe('LocationRepositoryAdapter', () => {
  beforeEach(async () => {
    await locationDb.adminLocations.clear();
  });

  it('persists and queries locations by level and parent', async () => {
    await locationRepository.save(SAMPLE);

    expect(await locationRepository.hasData()).toBe(true);
    expect(await locationRepository.findByLevel('DISTRICT')).toEqual([SAMPLE[0]]);
    expect(await locationRepository.findByParentId('district-1')).toEqual([SAMPLE[1]]);
    expect(await locationRepository.findByParentId('subcounty-1')).toEqual([SAMPLE[2]]);
    expect(await locationRepository.findByParentId('parish-1')).toEqual([SAMPLE[3]]);
  });

  it('replaces the dataset on save', async () => {
    await locationRepository.save(SAMPLE);
    await locationRepository.save([SAMPLE[0]]);

    expect(await locationRepository.findByLevel('DISTRICT')).toHaveLength(1);
    expect(await locationRepository.findByParentId('district-1')).toEqual([]);
  });
});
