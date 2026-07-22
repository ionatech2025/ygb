import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SYNC_RETRY_MAX_MS,
  calculateSyncRetryDelayMs,
  SyncRetryScheduler,
} from './sync-retry-scheduler';

describe('calculateSyncRetryDelayMs', () => {
  it('returns 5 s → 10 s → 20 s → 40 s for successive failures', () => {
    expect(calculateSyncRetryDelayMs(1)).toBe(5_000);
    expect(calculateSyncRetryDelayMs(2)).toBe(10_000);
    expect(calculateSyncRetryDelayMs(3)).toBe(20_000);
    expect(calculateSyncRetryDelayMs(4)).toBe(40_000);
  });

  it('caps delay at 300 s', () => {
    expect(calculateSyncRetryDelayMs(7)).toBe(SYNC_RETRY_MAX_MS);
    expect(calculateSyncRetryDelayMs(20)).toBe(SYNC_RETRY_MAX_MS);
  });
});

describe('SyncRetryScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes onRetryDue after the computed delay', () => {
    const onRetryDue = vi.fn();
    const scheduler = new SyncRetryScheduler(onRetryDue);

    scheduler.schedule(1);
    expect(onRetryDue).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5_000);
    expect(onRetryDue).toHaveBeenCalledTimes(1);
  });

  it('doubles the delay on the next schedule after another failure', () => {
    const onRetryDue = vi.fn();
    const scheduler = new SyncRetryScheduler(onRetryDue);

    scheduler.schedule(1);
    vi.advanceTimersByTime(5_000);
    expect(onRetryDue).toHaveBeenCalledTimes(1);

    scheduler.schedule(2);
    vi.advanceTimersByTime(9_999);
    expect(onRetryDue).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(onRetryDue).toHaveBeenCalledTimes(2);
  });

  it('cancel clears a pending retry', () => {
    const onRetryDue = vi.fn();
    const scheduler = new SyncRetryScheduler(onRetryDue);

    scheduler.schedule(1);
    scheduler.cancel();
    vi.advanceTimersByTime(10_000);
    expect(onRetryDue).not.toHaveBeenCalled();
  });
});
