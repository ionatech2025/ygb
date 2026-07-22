import type { AdminLocation } from '../../../core/domain/admin-location.model';
import { API_BASE } from '../../../core/api/api-base';

const ETAG_KEY = 'ygb:location-etag';

interface DatasetResponse {
  locations: Array<{
    id: string;
    name: string;
    parentId: string | null;
    level: string;
  }>;
}

function mapLocation(dto: DatasetResponse['locations'][number]): AdminLocation {
  return {
    id: dto.id,
    name: dto.name,
    parentId: dto.parentId,
    level: dto.level as AdminLocation['level'],
  };
}

export interface LocationFetchResult {
  locations: AdminLocation[];
  etag: string | null;
}

export async function fetchLocationDataset(
  cachedEtag: string | null
): Promise<LocationFetchResult | null> {
  const headers: HeadersInit = {};
  if (cachedEtag) {
    headers['If-None-Match'] = cachedEtag;
  }

  const response = await fetch(`${API_BASE}/api/v1/locations/dataset`, { headers });

  if (response.status === 304) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Unable to load administrative location dataset.');
  }

  const body = (await response.json()) as DatasetResponse;
  return {
    locations: body.locations.map(mapLocation),
    etag: response.headers.get('ETag'),
  };
}

export function readLocationEtag(): string | null {
  return localStorage.getItem(ETAG_KEY);
}

export function writeLocationEtag(etag: string | null): void {
  if (etag) {
    localStorage.setItem(ETAG_KEY, etag);
  } else {
    localStorage.removeItem(ETAG_KEY);
  }
}
