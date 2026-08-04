import { useMemo, useState } from 'react';
import { AlertCircle, FileDown, Loader2 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import {
  DOWNLOAD_SESSION_REJECTED_MESSAGE,
  isDownloadSessionRejectedStatus,
} from '../../../../core/domain/download-session-headers';
import { LGO_BUDGET_ALLOCATION_EXPORT_FORMAT_LABELS } from '../../../../core/domain/lgo-budget-allocation-export.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { useLgoBudgetAllocationDashboardFilterStore } from '../../../../core/store/useLgoBudgetAllocationDashboardFilterStore';
import { HttpLgoBudgetAllocationExportAdapter } from '../../../secondary/api/lgo-budget-allocation-export-api.adapter';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import type { ILgoBudgetAllocationExportApiPort } from '../../../../ports/lgo-budget-allocation-export-api.port';
import {
  clearRejectedDownloadSession,
  useGatedPublicDownload,
} from './useGatedPublicDownload';

export interface LgoBudgetAllocationExportToolbarProps {
  exportApi?: ILgoBudgetAllocationExportApiPort;
  profileApi?: IDownloadProfileApiPort;
  layout?: 'card' | 'inline';
}

export function LgoBudgetAllocationExportToolbar({
  exportApi,
  profileApi,
  layout = 'inline',
}: LgoBudgetAllocationExportToolbarProps) {
  const filter = useLgoBudgetAllocationDashboardFilterStore((state) => state.filter);
  const adapter = useMemo(
    () => exportApi ?? new HttpLgoBudgetAllocationExportAdapter(),
    [exportApi]
  );
  const { runWithDownloadSession, downloadProfileDialog } = useGatedPublicDownload(profileApi);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = () => {
    setError('');
    void runWithDownloadSession(async (sessionToken) => {
      setLoading(true);
      try {
        await adapter.downloadCsv(filter, sessionToken);
      } catch (err) {
        if (err instanceof ApiError && isDownloadSessionRejectedStatus(err.status)) {
          clearRejectedDownloadSession();
          setError(DOWNLOAD_SESSION_REJECTED_MESSAGE);
        } else {
          setError(
            err instanceof ApiError || err instanceof Error
              ? err.message
              : 'Export failed. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const button = (
    <button
      type="button"
      data-testid="lgo-export-csv"
      disabled={loading}
      onClick={handleExport}
      className={`${publicDashboardClasses.exportButton} ${publicDashboardClasses.exportButtonPrimary} min-w-[9.5rem]`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <FileDown className="h-4 w-4" aria-hidden="true" />
      )}
      {LGO_BUDGET_ALLOCATION_EXPORT_FORMAT_LABELS.csv}
    </button>
  );

  const errorBanner = error ? (
    <div
      role="alert"
      data-testid="lgo-budget-allocation-export-error"
      className={`mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300 ${
        layout === 'inline' ? 'px-3 py-2.5' : 'px-4 py-3'
      }`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{error}</span>
    </div>
  ) : null;

  if (layout === 'inline') {
    return (
      <>
        <div
          className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
          data-testid="lgo-budget-allocation-export-toolbar"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Download dataset
          </p>
          <p className="mb-4 text-sm leading-relaxed text-text-muted">
            Export the current filter selection as anonymised CSV.
          </p>
          {button}
          {errorBanner}
        </div>
        {downloadProfileDialog}
      </>
    );
  }

  return (
    <>
      <div
        className={`${publicDashboardClasses.panel} p-4 sm:p-5`}
        data-testid="lgo-budget-allocation-export-toolbar"
      >
        <p className="mb-4 text-sm leading-relaxed text-text-muted">
          Download the currently filtered anonymised LG Budget Allocation dataset.
        </p>
        {button}
        {errorBanner}
      </div>
      {downloadProfileDialog}
    </>
  );
}
