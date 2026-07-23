import { useEffect, useMemo, useState } from 'react';
import { Radio } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import type { AdminReceiptStatus } from '../../../../core/domain/admin-receipt-status.model';
import { HttpAdminSyncStatusAdapter } from '../../../secondary/api/admin-sync-status-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { IAdminSyncStatusApiPort } from '../../../../ports/admin-sync-status-api.port';
import { AdminPageHeader } from './AdminPageHeader';
import { adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';
import { CollectorReceiptTable } from './CollectorReceiptTable';
import { ReceiptStatusSummary } from './ReceiptStatusSummary';

export interface AdminSyncStatusPageProps {
  syncStatusApi?: IAdminSyncStatusApiPort;
}

export function AdminSyncStatusPage({ syncStatusApi: syncStatusApiProp }: AdminSyncStatusPageProps = {}) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const syncStatusApi = useMemo(
    () => syncStatusApiProp ?? new HttpAdminSyncStatusAdapter(getAccessToken),
    [syncStatusApiProp, getAccessToken]
  );

  const [status, setStatus] = useState<AdminReceiptStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await syncStatusApi.fetchReceiptStatus();
        if (!cancelled) {
          setStatus(result);
        }
      } catch (err) {
        if (!cancelled) {
          setStatus(null);
          setError(
            err instanceof ApiError || err instanceof Error ? err.message : 'Failed to load receipt status.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [syncStatusApi]);

  return (
    <div className={adminDashboardClasses.page} data-testid="admin-sync-status-page">
      <AdminPageHeader
        eyebrow="Sync monitoring"
        title="Sync Receipt Status"
        description="Server-side submission receipt metrics by collector. Stale collectors have not synced in over 48 hours."
        icon={<Radio className="h-7 w-7" aria-hidden="true" />}
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      <ReceiptStatusSummary status={status} loading={loading} />
      <CollectorReceiptTable rows={status?.byCollector ?? []} loading={loading} />
    </div>
  );
}
