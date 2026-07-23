import { useMemo, useState } from 'react';
import { AlertCircle, FileDown, FileSpreadsheet, Loader2 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import {
  PUBLIC_EXPORT_FORMAT_LABELS,
  type PublicExportFormat,
} from '../../../../core/domain/public-export.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { useBudgetPriorityDashboardFilterStore } from '../../../../core/store/useBudgetPriorityDashboardFilterStore';
import { HttpBudgetPriorityExportAdapter } from '../../../secondary/api/budget-priority-export-api.adapter';
import type { IBudgetPriorityExportApiPort } from '../../../../ports/budget-priority-export-api.port';

const EXPORT_FORMATS: PublicExportFormat[] = ['csv', 'xlsx'];

const FORMAT_ICONS: Record<PublicExportFormat, typeof FileDown> = {
  csv: FileDown,
  xlsx: FileSpreadsheet,
};

export interface BudgetPriorityExportToolbarProps {
  exportApi?: IBudgetPriorityExportApiPort;
  layout?: 'card' | 'inline';
}

export function BudgetPriorityExportToolbar({
  exportApi,
  layout = 'inline',
}: BudgetPriorityExportToolbarProps) {
  const filter = useBudgetPriorityDashboardFilterStore((state) => state.filter);
  const adapter = useMemo(() => exportApi ?? new HttpBudgetPriorityExportAdapter(), [exportApi]);

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

  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${layout === 'inline' ? 'xl:flex-col' : ''}`}>
      {EXPORT_FORMATS.map((format) => {
        const busy = activeFormat === format;
        const disabled = activeFormat !== null;
        const Icon = FORMAT_ICONS[format];
        const buttonClass =
          format === 'csv'
            ? `${publicDashboardClasses.exportButton} ${publicDashboardClasses.exportButtonPrimary} min-w-[9.5rem]`
            : `${publicDashboardClasses.exportButton} ${publicDashboardClasses.exportButtonSecondary} min-w-[9.5rem]`;

        return (
          <button
            key={format}
            type="button"
            data-testid={`bp-export-${format}`}
            disabled={disabled}
            onClick={() => void handleExport(format)}
            className={buttonClass}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icon className="h-4 w-4" aria-hidden="true" />
            )}
            {PUBLIC_EXPORT_FORMAT_LABELS[format]}
          </button>
        );
      })}
    </div>
  );

  if (layout === 'inline') {
    return (
      <div
        className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
        data-testid="budget-priority-export-toolbar"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Download dataset</p>
        <p className="mb-4 text-sm leading-relaxed text-text-muted">
          Export the current filter selection as anonymised CSV or Excel.
        </p>
        {buttons}
        {error && (
          <div
            role="alert"
            data-testid="budget-priority-export-error"
            className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${publicDashboardClasses.panel} p-4 sm:p-5`} data-testid="budget-priority-export-toolbar">
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        Download the currently filtered anonymised Budget Priorities dataset.
      </p>
      {buttons}
      {error && (
        <div
          role="alert"
          data-testid="budget-priority-export-error"
          className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
