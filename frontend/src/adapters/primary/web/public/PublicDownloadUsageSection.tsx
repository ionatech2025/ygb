import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Download, TrendingUp } from 'lucide-react';
import {
  EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES,
  type PublicDownloadUsageAggregates,
} from '../../../../core/domain/public-download-usage.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import type { IPublicDownloadUsageApiPort } from '../../../../ports/public-download-usage-api.port';
import { HttpPublicDownloadUsageAdapter } from '../../../secondary/api/public-download-usage-api.adapter';
import { PublicDashboardPanel, PublicDashboardSection } from './PublicDashboardPanel';
import { PublicDownloadUsageDatasetChart } from './PublicDownloadUsageDatasetChart';
import { PublicDownloadUsageOverTimeChart } from './PublicDownloadUsageOverTimeChart';

export interface PublicDownloadUsageSectionProps {
  downloadUsageApi?: IPublicDownloadUsageApiPort;
}

export function PublicDownloadUsageSection({ downloadUsageApi: apiProp }: PublicDownloadUsageSectionProps) {
  const api = useMemo(() => apiProp ?? new HttpPublicDownloadUsageAdapter(), [apiProp]);

  const [aggregates, setAggregates] = useState<PublicDownloadUsageAggregates>(
    EMPTY_PUBLIC_DOWNLOAD_USAGE_AGGREGATES
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.fetchPublicDownloadUsage();
        if (!cancelled) {
          setAggregates(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load public download usage analytics.');
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
  }, [api]);

  return (
    <PublicDashboardSection
      title="Open Data Usage & Downloads"
      icon={<Download className="h-5 w-5" aria-hidden="true" />}
      testId="public-download-usage-section"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-muted sm:text-sm">
          Anonymised aggregates tracking open data downloads across PDM, Budget Priorities, and LGO datasets. No personal data stored or displayed.
        </p>
        <div
          data-testid="public-total-downloads-badge"
          className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light/60 px-3.5 py-1.5 text-xs font-semibold text-brand dark:bg-brand/15"
        >
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          <span>Total Open Data Downloads: {aggregates.totalDownloads.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          data-testid="public-download-usage-error"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div
          data-testid="public-download-usage-skeleton"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          aria-busy="true"
          aria-label="Loading download usage charts"
        >
          <div className={`animate-pulse ${publicDashboardClasses.chartPanel}`}>
            <div className="mb-4 h-3 w-40 rounded bg-surface-muted" />
            <div className="h-64 rounded bg-surface-muted" />
          </div>
          <div className={`animate-pulse ${publicDashboardClasses.chartPanel}`}>
            <div className="mb-4 h-3 w-40 rounded bg-surface-muted" />
            <div className="h-64 rounded bg-surface-muted" />
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          data-testid="public-download-usage-charts-grid"
        >
          <PublicDashboardPanel
            title="Downloads over time"
            testId="panel-public-downloads-over-time"
          >
            <PublicDownloadUsageOverTimeChart data={aggregates.downloadsOverTime} />
          </PublicDashboardPanel>

          <PublicDashboardPanel
            title="Dataset comparison (PDM vs Budget Priorities vs LGO)"
            testId="panel-public-dataset-comparison"
          >
            <PublicDownloadUsageDatasetChart data={aggregates.byDataset} />
          </PublicDashboardPanel>
        </div>
      )}
    </PublicDashboardSection>
  );
}
