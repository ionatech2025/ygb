import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdminLocation } from './domain/admin-location.model';
import { LocationService } from './LocationService';
import type { ILocationRepositoryPort } from '../ports/location-repository.port';

const dataset: AdminLocation[] = [
  { id: 'district-1', name: 'Kampala', parentId: null, level: 'DISTRICT' },
  { id: 'district-2', name: 'Ntungamo', parentId: null, level: 'DISTRICT' },
];

const fetchLocationDataset = vi.fn();
const readLocationEtag = vi.fn();
const writeLocationEtag = vi.fn();

vi.mock('../adapters/secondary/location/location-api.adapter', () => ({
  fetchLocationDataset: (...args: unknown[]) => fetchLocationDataset(...args),
  readLocationEtag: () => readLocationEtag(),
  writeLocationEtag: (etag: string | null) => writeLocationEtag(etag),
}));

function createRepository(initial = false): ILocationRepositoryPort {
  let stored: AdminLocation[] = [];
  return {
    save: vi.fn(async (locations: AdminLocation[]) => {
      stored = locations;
    }),
    clear: vi.fn(async () => {
      stored = [];
    }),
    hasData: vi.fn(async () => stored.length > 0 || initial),
    findByLevel: vi.fn(),
    findByParentId: vi.fn(),
  };
}

describe('LocationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readLocationEtag.mockReturnValue(null);
    fetchLocationDataset.mockResolvedValue({ locations: dataset, etag: 'etag-v1' });
  });

  it('fetches from the network when the local cache is empty', async () => {
    const repository = createRepository(false);
    const service = new LocationService(repository);

    await service.ensureLoaded();

    expect(fetchLocationDataset).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(dataset);
    expect(writeLocationEtag).toHaveBeenCalledWith('etag-v1');
  });

  it('serves cached data offline without fetching when cache exists', async () => {
    const repository = createRepository(true);
    const service = new LocationService(repository);
    const online = Object.getOwnPropertyDescriptor(navigator, 'onLine');
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });

    await service.ensureLoaded();

    expect(fetchLocationDataset).not.toHaveBeenCalled();

    if (online) {
      Object.defineProperty(navigator, 'onLine', online);
    }
  });

  it('refreshes in the background on load when online and cache exists', async () => {
    const repository = createRepository(true);
    const service = new LocationService(repository);
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    readLocationEtag.mockReturnValue('etag-v0');
    fetchLocationDataset.mockResolvedValue(null);

    await service.ensureLoaded();

    expect(fetchLocationDataset).toHaveBeenCalledWith('etag-v0');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('records a fetch failure when online with an empty cache', async () => {
    const repository = createRepository(false);
    const service = new LocationService(repository);
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    fetchLocationDataset.mockRejectedValue(new Error('Network error'));

    await service.ensureLoaded();

    expect(service.getLoadError()).toBe('fetch-failed');
  });
});
