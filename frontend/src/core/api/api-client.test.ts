import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './api-client';

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws ApiError when a successful response body is HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('<!doctype html><html><body>SPA shell</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      )
    );

    await expect(apiFetch('/api/v1/public/dashboard/summary')).rejects.toMatchObject({
      name: 'ApiError',
      status: 200,
      message: expect.stringContaining('VITE_API_BASE_URL'),
    });
  });

  it('returns parsed JSON for application/json responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ totalSubmissions: 3 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await expect(apiFetch<{ totalSubmissions: number }>('/api/v1/public/dashboard/summary')).resolves.toEqual({
      totalSubmissions: 3,
    });
  });
});
