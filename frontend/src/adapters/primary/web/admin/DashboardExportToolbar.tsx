import { useMemo, useState } from 'react';
import { AlertCircle, FileDown, Loader2 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { EXPORT_FORMAT_LABELS, type ExportFormat } from '../../../../core/domain/export.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import { HttpSubmissionExportAdapter } from '../../../secondary/api/submission-export-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ISubmissionExportApiPort } from '../../../../ports/submission-export-api.port';

const EXPORT_FORMATS: ExportFormat[] = ['csv', 'xlsx', 'pdf'];

export interface DashboardExportToolbarProps {
  exportApi?: ISubmissionExportApiPort;
}

export function DashboardExportToolbar({ exportApi }: DashboardExportToolbarProps) {
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

  return (
    <div className="space-y-3" data-testid="dashboard-export-toolbar">
      <div className="flex flex-wrap gap-2">
        {EXPORT_FORMATS.map((format) => {
          const busy = activeFormat === format;
          const disabled = activeFormat !== null;
          return (
            <button
              key={format}
              type="button"
              data-testid={`export-${format}`}
              disabled={disabled}
              onClick={() => void handleExport(format)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand" aria-hidden="true" />
              ) : (
                <FileDown className="h-4 w-4 text-brand" aria-hidden="true" />
              )}
              {EXPORT_FORMAT_LABELS[format]}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          data-testid="dashboard-export-error"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
