import { Hash } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { useSubmissionCountStore } from '../../../../core/store/useSubmissionCountStore';

export function SubmissionCountBadge() {
  const todayCount = useSubmissionCountStore((state) => state.todayCount);
  const initialize = useSubmissionCountStore((state) => state.initialize);
  const reconcileWithServer = useSubmissionCountStore((state) => state.reconcileWithServer);
  const ensureCurrentDay = useSubmissionCountStore((state) => state.ensureCurrentDay);
  const isOnline = useAuthStore((state) => state.isOnline);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    ensureCurrentDay();
    const token = getAccessToken();
    if (isOnline && token) {
      void reconcileWithServer(token);
    }
  }, [isOnline, getAccessToken, reconcileWithServer, ensureCurrentDay]);

  return (
    <span
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand/20 bg-brand-light px-2.5 text-[11px] font-bold text-brand dark:border-brand/30 dark:bg-brand/15"
      aria-label={`Today's submissions: ${todayCount}`}
      data-testid="submission-count-badge"
    >
      <Hash className="h-3 w-3" aria-hidden="true" />
      <span className="uppercase tracking-wide">Today</span>
      <span className="rounded-md bg-surface/80 px-1.5 py-0.5 text-text dark:bg-surface/40">{todayCount}</span>
    </span>
  );
}
