import { ApiError } from './api/api-client';
import type { ISubmissionApiPort } from '../ports/submission-api.port';
import type { ISubmissionQueuePort } from '../ports/submission-queue.port';

export interface SyncEngineCallbacks {
  onSynced?: (localId: number) => void;
  onFailed?: (localId: number, error: string, retryCount: number) => void;
  onComplete?: (result: { syncedCount: number; failedCount: number }) => void;
}

export class SyncEngine {
  private syncing = false;

  constructor(
    private queue: ISubmissionQueuePort,
    private api: ISubmissionApiPort,
    private callbacks: SyncEngineCallbacks = {}
  ) {}

  async syncPending(): Promise<void> {
    if (this.syncing) return;
    this.syncing = true;

    let syncedCount = 0;
    let failedCount = 0;
    try {
      const pending = await this.queue.dequeueAll();
      for (const submission of pending) {
        if (submission.localId == null) continue;

        try {
          await this.api.syncSubmission(submission);
          await this.queue.markSynced(submission.localId);
          syncedCount += 1;
          this.callbacks.onSynced?.(submission.localId);
        } catch (err) {
          if (err instanceof ApiError && err.status === 409) {
            await this.queue.markSynced(submission.localId);
            syncedCount += 1;
            this.callbacks.onSynced?.(submission.localId);
            continue;
          }

          const nextRetryCount = submission.retryCount + 1;
          const message = err instanceof Error ? err.message : 'Sync failed';
          await this.queue.markFailed(submission.localId, nextRetryCount);
          failedCount += 1;
          this.callbacks.onFailed?.(submission.localId, message, nextRetryCount);
        }
      }
    } finally {
      this.syncing = false;
      this.callbacks.onComplete?.({ syncedCount, failedCount });
    }
  }
}
