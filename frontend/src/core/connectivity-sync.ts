import { useAuthStore } from './store/useAuthStore';
import { useSubmissionCountStore } from './store/useSubmissionCountStore';
import { useSyncStore } from './store/useSyncStore';

/**
 * Restores auth tokens if needed, flushes the offline submission queue,
 * and reconciles collector submission counts with the server.
 * Safe to call repeatedly — SyncEngine ignores overlapping runs.
 */
export async function syncWhenConnectivityAllows(): Promise<void> {
  if (!useAuthStore.getState().isOnline) {
    return;
  }

  await useAuthStore.getState().restoreCachedTokensIfNeeded();
  await useSyncStore.getState().triggerSync();

  const token = useAuthStore.getState().getAccessToken();
  if (token) {
    await useSubmissionCountStore.getState().reconcileWithServer(token);
  }
}
