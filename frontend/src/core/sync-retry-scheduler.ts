export const SYNC_RETRY_INITIAL_MS = 5_000;
export const SYNC_RETRY_MAX_MS = 300_000;

export function calculateSyncRetryDelayMs(retryCount: number): number {
  if (retryCount <= 0) return SYNC_RETRY_INITIAL_MS;
  const delay = SYNC_RETRY_INITIAL_MS * 2 ** (retryCount - 1);
  return Math.min(delay, SYNC_RETRY_MAX_MS);
}

export class SyncRetryScheduler {
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private scheduledAtMs = 0;

  constructor(private readonly onRetryDue: () => void) {}

  schedule(retryCount: number): void {
    const delayMs = calculateSyncRetryDelayMs(retryCount);
    const dueAt = Date.now() + delayMs;

    if (this.timerId != null && dueAt <= this.scheduledAtMs) {
      return;
    }

    this.cancel();
    this.scheduledAtMs = dueAt;
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.scheduledAtMs = 0;
      this.onRetryDue();
    }, delayMs);
  }

  cancel(): void {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.scheduledAtMs = 0;
    }
  }

  getScheduledAtMs(): number {
    return this.scheduledAtMs;
  }
}
