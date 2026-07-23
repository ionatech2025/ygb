import { useMemo, useState } from 'react';
import { AlertCircle, FileDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { EXPORT_FORMAT_LABELS, type ExportFormat } from '../../../../core/domain/export.model';
import { adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import { HttpSubmissionExportAdapter } from '../../../secondary/api/submission-export-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ISubmissionExportApiPort } from '../../../../ports/submission-export-api.port';

const EXPORT_FORMATS: ExportFormat[] = ['csv', 'xlsx', 'pdf'];

const FORMAT_ICONS: Record<ExportFormat, typeof FileDown> = {
  csv: FileDown,
  xlsx: FileSpreadsheet,
  pdf: FileText,
};

const FORMAT_BUTTON_CLASS: Record<ExportFormat, string> = {
  csv: adminDashboardClasses.exportButtonPrimary,
  xlsx: adminDashboardClasses.exportButtonSecondary,
  pdf: adminDashboardClasses.exportButtonNeutral,
};

export interface DashboardExportToolbarProps {
  exportApi?: ISubmissionExportApiPort;
  layout?: 'card' | 'inline';
}

export function DashboardExportToolbar({ exportApi, layout = 'card' }: DashboardExportToolbarProps) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const filter = useDashboardFilterStore((state) => state.filter);
  const adapter = useMemo(
    () => exportApi ?? new HttpSubmissionExportAdapter(getAccessToken),
    [exportApi, getAccessToken]
  );

  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);
  const [error, setError] = useState('');

  const handleExport = async (format: ExportFormat) => {
    setActiveFormat(format);
    setError('');
    try {
      await adapter.downloadExport(format, filter);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Export failed. Please try again.'
      );
    } finally {
      setActiveFormat(null);
    }
  };

  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${layout === 'inline' ? 'xl:flex-col' : ''}`}>
      {EXPORT_FORMATS.map((format) => {
        const busy = activeFormat === format;
        const disabled = activeFormat !== null;
        const Icon = FORMAT_ICONS[format];

        return (
          <button
            key={format}
            type="button"
            data-testid={`export-${format}`}
            disabled={disabled}
            onClick={() => void handleExport(format)}
            className={`${adminDashboardClasses.exportButton} ${FORMAT_BUTTON_CLASS[format]} min-w-[9.5rem]`}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icon className="h-4 w-4" aria-hidden="true" />
            )}
            {EXPORT_FORMAT_LABELS[format]}
          </button>
        );
      })}
    </div>
  );

  const errorAlert = error ? (
    <div
      role="alert"
      data-testid="dashboard-export-error"
      className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{error}</span>
    </div>
  ) : null;

  if (layout === 'inline') {
    return (
      <div
        className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
        data-testid="dashboard-export-toolbar"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Export reports</p>
        <p className="mb-4 text-sm leading-relaxed text-text-muted">
          Download the current filter selection as CSV, Excel, or PDF.
        </p>
        {buttons}
        {errorAlert}
      </div>
    );
  }

  return (
    <div className={adminDashboardClasses.exportToolbar} data-testid="dashboard-export-toolbar">
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        Download the currently filtered dataset for offline review or stakeholder reports.
      </p>
      {buttons}
      {errorAlert}
    </div>
  );
}
