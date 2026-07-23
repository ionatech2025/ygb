import { useMemo, useState } from 'react';
import { AlertCircle, FileDown, Loader2 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import {
  PUBLIC_EXPORT_FORMAT_LABELS,
  type PublicExportFormat,
} from '../../../../core/domain/public-export.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import { HttpPublicExportAdapter } from '../../../secondary/api/public-export-api.adapter';
import type { IPublicExportApiPort } from '../../../../ports/public-export-api.port';

const PUBLIC_EXPORT_FORMATS: PublicExportFormat[] = ['csv', 'xlsx'];

export interface PublicDashboardExportToolbarProps {
  exportApi?: IPublicExportApiPort;
}

export function PublicDashboardExportToolbar({ exportApi }: PublicDashboardExportToolbarProps) {
  const filter = usePublicDashboardFilterStore((state) => state.filter);
  const adapter = useMemo(() => exportApi ?? new HttpPublicExportAdapter(), [exportApi]);

  const [activeFormat, setActiveFormat] = useState<PublicExportFormat | null>(null);
  const [error, setError] = useState('');

  const handleExport = async (format: PublicExportFormat) => {
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
    <div className={`${publicDashboardClasses.panel} p-4 sm:p-5`} data-testid="public-dashboard-export-toolbar">
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        Download the currently filtered anonymised dataset for offline review or stakeholder packs.
      </p>

      <div className="flex flex-wrap gap-3">
        {PUBLIC_EXPORT_FORMATS.map((format) => {
          const busy = activeFormat === format;
          const disabled = activeFormat !== null;
          return (
            <button
              key={format}
              type="button"
              data-testid={`public-export-${format}`}
              disabled={disabled}
              onClick={() => void handleExport(format)}
              className={publicDashboardClasses.exportButton}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand" aria-hidden="true" />
              ) : (
                <FileDown className="h-4 w-4 text-brand" aria-hidden="true" />
              )}
              {PUBLIC_EXPORT_FORMAT_LABELS[format]}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          data-testid="public-dashboard-export-error"
          className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
