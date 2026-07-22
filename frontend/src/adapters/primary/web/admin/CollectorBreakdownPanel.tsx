import type { CollectorBreakdown } from '../../../../core/domain/collector-tracker.model';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';

function formTypeLabel(formType: string): string {
  return FORM_TYPE_OPTIONS.find((option) => option.value === formType)?.label ?? formType;
}

export interface CollectorBreakdownPanelProps {
  collectorName: string;
  breakdown: CollectorBreakdown | null;
  loading?: boolean;
  error?: string;
}

export function CollectorBreakdownPanel({
  collectorName,
  breakdown,
  loading = false,
  error = '',
}: CollectorBreakdownPanelProps) {
  return (
    <div
      className="rounded-2xl border border-border bg-surface-muted/40 p-4"
      data-testid="collector-breakdown-panel"
    >
      <h3 className="text-sm font-bold text-text">Breakdown for {collectorName}</h3>

      {loading && <p className="mt-3 text-sm text-text-muted">Loading breakdown…</p>}

      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {!loading && !error && breakdown && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <section data-testid="collector-breakdown-form-types">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">By form type</h4>
            {breakdown.byFormType.length === 0 ? (
              <p className="text-sm text-text-muted">No form type data.</p>
            ) : (
              <ul className="space-y-2">
                {breakdown.byFormType.map((entry) => (
                  <li
                    key={entry.formType}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    data-testid={`breakdown-form-type-${entry.formType}`}
                  >
                    <span>{formTypeLabel(entry.formType)}</span>
                    <span className="font-semibold text-text">{entry.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section data-testid="collector-breakdown-districts">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">By district</h4>
            {breakdown.byDistrict.length === 0 ? (
              <p className="text-sm text-text-muted">No district data.</p>
            ) : (
              <ul className="space-y-2">
                {breakdown.byDistrict.map((entry) => (
                  <li
                    key={entry.districtId}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    data-testid={`breakdown-district-${entry.districtId}`}
                  >
                    <span>{entry.districtName}</span>
                    <span className="font-semibold text-text">{entry.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
