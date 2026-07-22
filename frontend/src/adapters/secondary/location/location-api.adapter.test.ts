import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchLocationDataset,
  readLocationEtag,
  writeLocationEtag,
} from './location-api.adapter';

describe('location-api.adapter', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null on 304 Not Modified without overwriting cache', async () => {
    writeLocationEtag('etag-v1');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 304 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchLocationDataset('etag-v1');

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/locations/dataset', {
      headers: { 'If-None-Match': 'etag-v1' },
    });
    expect(readLocationEtag()).toBe('etag-v1');
  });

  it('maps dataset payload and stores ETag from response header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          locations: [
            {
              id: 'district-1',
              name: 'Kampala',
              parentId: null,
              level: 'DISTRICT',
            },
          ],
        }),
        {
          status: 200,
          headers: { ETag: '"etag-v2"' },
        }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchLocationDataset(null);

    expect(result?.locations).toEqual([
      { id: 'district-1', name: 'Kampala', parentId: null, level: 'DISTRICT' },
    ]);
    expect(result?.etag).toBe('"etag-v2"');
  });
});
