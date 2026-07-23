import { API_BASE } from './api-base';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const text = await response.text();
    let message = text || response.statusText;
    try {
      const json = JSON.parse(text) as { message?: string; detail?: string };
      if (json.detail) message = json.detail;
      else if (json.message) message = json.message;
    } catch {
      // plain-text error body
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
    return response.json() as Promise<T>;
  }

  const text = await response.text();
  const trimmed = text.trimStart();
  if (
    contentType.includes('text/html') ||
    trimmed.startsWith('<!') ||
    trimmed.toLowerCase().startsWith('<html')
  ) {
    throw new ApiError(
      'API returned HTML instead of JSON. Set VITE_API_BASE_URL to your backend URL at build time.',
      response.status
    );
  }

  return text as T;
}
