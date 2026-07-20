import type { ILocationRepositoryPort } from '../ports/location-repository.port';
import {
  fetchLocationDataset,
  readLocationEtag,
  writeLocationEtag,
} from '../adapters/secondary/location/location-api.adapter';
import { locationRepository } from '../adapters/secondary/location/location-repository.adapter';

export class LocationService {
  private loadingPromise: Promise<void> | null = null;

  constructor(private readonly repository: ILocationRepositoryPort = locationRepository) {}

  async ensureLoaded(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadInternal().finally(() => {
      this.loadingPromise = null;
    });

    return this.loadingPromise;
  }

  private async loadInternal(): Promise<void> {
    if (await this.repository.hasData()) {
      if (navigator.onLine) {
        await this.refreshInBackground();
      }
      return;
    }

    if (!navigator.onLine) {
      return;
    }

    await this.fetchAndPersist();
  }

  private async refreshInBackground(): Promise<void> {
    try {
      const result = await fetchLocationDataset(readLocationEtag());
      if (result) {
        await this.repository.save(result.locations);
        writeLocationEtag(result.etag);
      }
    } catch {
      // Keep serving cached data when background refresh fails.
    }
  }

  private async fetchAndPersist(): Promise<void> {
    const result = await fetchLocationDataset(readLocationEtag());
    if (!result) {
      return;
    }
    await this.repository.save(result.locations);
    writeLocationEtag(result.etag);
  }
}

export const locationService = new LocationService();
