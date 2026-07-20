import { apiFetch } from './api-client';

export interface CollectorSyncStatusDto {
  syncedCount: number;
  lastSyncedAt: string | null;
}

export async function fetchCollectorSubmissionCount(accessToken: string): Promise<number> {
  return apiFetch<number>('/api/v1/submissions/my-count', { method: 'GET' }, accessToken);
}

export async function fetchCollectorSyncStatus(accessToken: string): Promise<CollectorSyncStatusDto> {
  return apiFetch<CollectorSyncStatusDto>('/api/v1/submissions/my-sync-status', { method: 'GET' }, accessToken);
}
