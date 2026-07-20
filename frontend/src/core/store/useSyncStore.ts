import { create } from 'zustand';
import { httpSubmissionApi } from '../../adapters/secondary/api/http-submission-api.adapter';
import { submissionQueue } from '../../adapters/secondary/submission/submission-queue.adapter';
import { SyncEngine } from '../SyncEngine';
import { useAuthStore } from './useAuthStore';
import { useSubmissionCountStore } from './useSubmissionCountStore';

interface SyncStoreState {
  pendingCount: number;
  lastSyncedAt: Date | null;
  lastSyncError: string | null;
  syncing: boolean;
  initialize: () => Promise<void>;
  refreshPendingCount: () => Promise<void>;
  triggerSync: () => Promise<void>;
}

const syncEngine = new SyncEngine(submissionQueue, httpSubmissionApi, {
  onSynced: () => {
    void useSyncStore.getState().refreshPendingCount();
  },
  onFailed: (_localId, error) => {
    useSyncStore.setState({ lastSyncError: error });
  },
  onComplete: async () => {
    const lastSyncedAt = await submissionQueue.getLastSyncedAt();
    useSyncStore.setState({ lastSyncedAt, lastSyncError: null });
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

  refreshPendingCount: async () => {
    const pendingCount = await submissionQueue.countPending();
    set({ pendingCount });
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
