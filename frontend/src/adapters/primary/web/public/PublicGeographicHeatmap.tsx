import { useMemo, useState } from 'react';
import type { PublicHeatmapEntry } from '../../../../core/domain/public-dashboard-charts.model';

export interface PublicGeographicHeatmapProps {
  data: PublicHeatmapEntry[];
}

function regionKey(entry: PublicHeatmapEntry): string {
  return entry.parishId ?? entry.districtId ?? entry.label;
}

function intensityClass(count: number, maxCount: number): string {
  if (maxCount <= 0 || count <= 0) {
    return 'bg-surface-muted';
  }
  const ratio = count / maxCount;
  if (ratio >= 0.75) return 'bg-brand text-white';
  if (ratio >= 0.5) return 'bg-brand/70 text-white';
  if (ratio >= 0.25) return 'bg-brand/40 text-text';
  return 'bg-brand/15 text-text';
}

export function formatHeatmapTooltip(entry: PublicHeatmapEntry): string {
  return `${entry.label}: ${entry.count.toLocaleString('en-UG')} submissions`;
}

export function PublicGeographicHeatmap({ data }: PublicGeographicHeatmapProps) {
  const [activeRegion, setActiveRegion] = useState<PublicHeatmapEntry | null>(null);
  const maxCount = useMemo(() => Math.max(...data.map((entry) => entry.count), 0), [data]);

  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-text-muted" data-testid="chart-heatmap-empty">
        No geographic data for the current filters.
      </p>
    );
  }

  return (
    <div data-testid="public-geographic-heatmap" className="space-y-3">
      {activeRegion ? (
        <div
          role="tooltip"
          data-testid="public-heatmap-tooltip"
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm"
        >
          {formatHeatmapTooltip(activeRegion)}
        </div>
      ) : (
        <p className="text-sm text-text-muted">Hover or focus a region to see submission counts.</p>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((entry) => {
          const key = regionKey(entry);
          return (
            <button
              key={key}
              type="button"
              data-testid={`heatmap-region-${key}`}
              aria-label={formatHeatmapTooltip(entry)}
              className={`min-h-11 rounded-xl border border-border px-4 py-3 text-left transition hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${intensityClass(entry.count, maxCount)}`}
              onMouseEnter={() => setActiveRegion(entry)}
              onFocus={() => setActiveRegion(entry)}
              onMouseLeave={() => setActiveRegion((current) => (current === entry ? null : current))}
              onBlur={() => setActiveRegion((current) => (current === entry ? null : current))}
            >
              <span className="block text-sm font-semibold">{entry.label}</span>
              <span className="mt-1 block text-xs opacity-90">{entry.count.toLocaleString('en-UG')} submissions</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
