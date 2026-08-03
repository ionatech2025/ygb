import { beforeEach, describe, expect, it, vi } from 'vitest';
import { syncWhenConnectivityAllows } from './connectivity-sync';
import { useAuthStore } from './store/useAuthStore';
import { useSubmissionCountStore } from './store/useSubmissionCountStore';
import { useSyncStore } from './store/useSyncStore';

vi.mock('./store/useAuthStore', () => {
  const state = {
    isOnline: true,
    restoreCachedTokensIfNeeded: vi.fn().mockResolvedValue(undefined),
    getAccessToken: vi.fn(() => 'token-1'),
  };
  return {
    useAuthStore: Object.assign((selector: (value: typeof state) => unknown) => selector(state), {
      getState: () => state,
    }),
  };
});

vi.mock('./store/useSyncStore', () => {
  const state = {
    triggerSync: vi.fn().mockResolvedValue(undefined),
  };
  return {
    useSyncStore: Object.assign((selector: (value: typeof state) => unknown) => selector(state), {
      getState: () => state,
    }),
  };
});

vi.mock('./store/useSubmissionCountStore', () => {
  const state = {
    reconcileWithServer: vi.fn().mockResolvedValue(undefined),
  };
  return {
    useSubmissionCountStore: Object.assign((selector: (value: typeof state) => unknown) => selector(state), {
      getState: () => state,
    }),
  };
});

describe('syncWhenConnectivityAllows', () => {
  beforeEach(() => {
    const auth = useAuthStore.getState();
    auth.isOnline = true;
    vi.mocked(auth.restoreCachedTokensIfNeeded).mockClear();
    vi.mocked(auth.getAccessToken).mockReturnValue('token-1');
    vi.mocked(useSyncStore.getState().triggerSync).mockClear();
    vi.mocked(useSubmissionCountStore.getState().reconcileWithServer).mockClear();
  });

  it('restores tokens, syncs queue, and reconciles counts when online', async () => {
    await syncWhenConnectivityAllows();

    expect(useAuthStore.getState().restoreCachedTokensIfNeeded).toHaveBeenCalled();
    expect(useSyncStore.getState().triggerSync).toHaveBeenCalled();
    expect(useSubmissionCountStore.getState().reconcileWithServer).toHaveBeenCalledWith('token-1');
  });

  it('skips sync work when offline', async () => {
    useAuthStore.getState().isOnline = false;

    await syncWhenConnectivityAllows();

    expect(useAuthStore.getState().restoreCachedTokensIfNeeded).not.toHaveBeenCalled();
    expect(useSyncStore.getState().triggerSync).not.toHaveBeenCalled();
    expect(useSubmissionCountStore.getState().reconcileWithServer).not.toHaveBeenCalled();
  });
});
