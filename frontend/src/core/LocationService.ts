import type { ILocationRepositoryPort } from '../ports/location-repository.port';
import {
  fetchLocationDataset,
  readLocationEtag,
  writeLocationEtag,
} from '../adapters/secondary/location/location-api.adapter';
import { locationRepository } from '../adapters/secondary/location/location-repository.adapter';

export class LocationService {
  private loadingPromise: Promise<void> | null = null;
  private loadError: string | null = null;

  constructor(private readonly repository: ILocationRepositoryPort = locationRepository) {}

  getLoadError(): string | null {
    return this.loadError;
  }

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
      this.loadError = null;
      if (navigator.onLine) {
        await this.refreshInBackground();
      }
      return;
    }

    if (!navigator.onLine) {
      this.loadError = 'offline-no-cache';
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
      this.loadError = null;
    } catch {
      // Keep serving cached data when background refresh fails.
    }
  }

  private async fetchAndPersist(): Promise<void> {
    try {
      const result = await fetchLocationDataset(readLocationEtag());
      if (!result) {
        if (await this.repository.hasData()) {
          this.loadError = null;
          return;
        }

        // Stale etag in localStorage but IndexedDB empty — refetch without conditional headers.
        const fresh = await fetchLocationDataset(null);
        if (!fresh) {
          this.loadError = 'fetch-failed';
          return;
        }
        await this.repository.save(fresh.locations);
        writeLocationEtag(fresh.etag);
        this.loadError = null;
        return;
      }
      await this.repository.save(result.locations);
      writeLocationEtag(result.etag);
      this.loadError = null;
    } catch {
      this.loadError = 'fetch-failed';
    }
  }
}

export const locationService = new LocationService();
