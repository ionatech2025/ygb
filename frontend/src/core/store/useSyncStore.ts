import { create } from 'zustand';
import { httpSubmissionApi } from '../../adapters/secondary/api/http-submission-api.adapter';
import { submissionQueue } from '../../adapters/secondary/submission/submission-queue.adapter';
import { SyncEngine } from '../SyncEngine';
import { SyncRetryScheduler } from '../sync-retry-scheduler';
import { useAuthStore } from './useAuthStore';
import { useSubmissionCountStore } from './useSubmissionCountStore';

interface SyncStoreState {
  pendingCount: number;
  lastSyncedAt: Date | null;
  lastSyncError: string | null;
  syncing: boolean;
  initialize: () => Promise<void>;
  incrementPendingCount: () => void;
  refreshPendingCount: () => Promise<void>;
  clearSyncError: () => void;
  triggerSync: () => Promise<void>;
}

const syncRetryScheduler = new SyncRetryScheduler(() => {
  void useSyncStore.getState().triggerSync();
});

const syncEngine = new SyncEngine(submissionQueue, httpSubmissionApi, {
  onSynced: () => {
    void useSyncStore.getState().refreshPendingCount();
  },
  onFailed: (_localId, error, retryCount) => {
    useSyncStore.setState({ lastSyncError: error });
    syncRetryScheduler.schedule(retryCount);
  },
  onComplete: async ({ failedCount }) => {
    const lastSyncedAt = await submissionQueue.getLastSyncedAt();
    const pendingCount = await submissionQueue.countPending();

    if (pendingCount === 0) {
      syncRetryScheduler.cancel();
    }

    useSyncStore.setState((state) => ({
      lastSyncedAt,
      lastSyncError: failedCount > 0 ? state.lastSyncError : null,
    }));
    void refreshSubmissionCounts();
  },
});

async function refreshSubmissionCounts(): Promise<void> {
  await useSubmissionCountStore.getState().refreshFromLocal();
  const token = useAuthStore.getState().getAccessToken();
  if (token && useAuthStore.getState().isOnline) {
    await useSubmissionCountStore.getState().reconcileWithServer(token);
  }
}

export const useSyncStore = create<SyncStoreState>((set, get) => ({
  pendingCount: 0,
  lastSyncedAt: null,
  lastSyncError: null,
  syncing: false,

  initialize: async () => {
    const lastSyncedAt = await submissionQueue.getLastSyncedAt();
    const pendingCount = await submissionQueue.countPending();
    set({ lastSyncedAt, pendingCount });
  },

  incrementPendingCount: () => {
    set((state) => ({ pendingCount: state.pendingCount + 1 }));
  },

  refreshPendingCount: async () => {
    const pendingCount = await submissionQueue.countPending();
    set({ pendingCount });
  },

  clearSyncError: () => {
    set({ lastSyncError: null });
  },

  triggerSync: async () => {
    const { isOnline } = useAuthStore.getState();
    if (!isOnline || !useAuthStore.getState().getAccessToken()) return;

    set({ syncing: true, lastSyncError: null });
    try {
      await syncEngine.syncPending();
    } finally {
      await get().refreshPendingCount();
      set({ syncing: false });
    }
  },
}));
