import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, BarChart3, Download, Users } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import {
  ADMIN_STAT_CARD_ACCENTS,
  adminDashboardClasses,
} from '../../../../core/domain/admin-dashboard.theme';
import {
  EMPTY_DOWNLOAD_USAGE_ANALYTICS_FILTER,
  toAgeGroupChartItems,
  toDownloadsOverTimeChartItems,
  toGenderChartItems,
  type DownloadUsageAggregates,
  type DownloadUsageAnalyticsFilter,
  type DownloaderSummary,
  type VisitsVsDownloadsComparison,
} from '../../../../core/domain/download-usage-analytics.model';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { IAdminDownloadUsageAnalyticsApiPort } from '../../../../ports/admin-download-usage-analytics-api.port';
import { HttpAdminDownloadUsageAnalyticsAdapter } from '../../../secondary/api/admin-download-usage-analytics-api.adapter';
import { GenderSplitChart } from './GenderSplitChart';
import { SubmissionsOverTimeChart } from './SubmissionsOverTimeChart';
import { AdminDownloadUsageFilterPanel } from './AdminDownloadUsageFilterPanel';
import { AdminPageHeader } from './AdminPageHeader';
import { DownloadUsageAgeGroupChart } from './DownloadUsageAgeGroupChart';
import { DownloadUsageDatasetChart } from './DownloadUsageDatasetChart';
import { DownloaderTable } from './DownloaderTable';
import { VisitsVsDownloadsChart } from './VisitsVsDownloadsChart';

const PAGE_SIZE = 25;

const EMPTY_AGGREGATES: DownloadUsageAggregates = {
  totalDownloaders: 0,
  totalDownloads: 0,
  byGender: [],
  byAgeGroup: [],
  byDataset: [],
  downloadsOverTime: [],
};

const EMPTY_VISITS: VisitsVsDownloadsComparison = {
  totalUniqueVisitors: 0,
  totalUniqueDownloaders: 0,
  overTime: [],
};

export interface AdminDownloadUsagePageProps {
  analyticsApi?: IAdminDownloadUsageAnalyticsApiPort;
}

function ChartPanel({
  title,
  testId,
  children,
  className,
}: {
  title: string;
  testId: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article data-testid={testId} className={`${adminDashboardClasses.chartPanel} ${className ?? ''}`}>
      <h3 className={adminDashboardClasses.chartPanelTitle}>
        <span className={adminDashboardClasses.chartPanelAccent} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </article>
  );
}

function StatCard({
  title,
  value,
  accentIndex,
  testId,
}: {
  title: string;
  value: number;
  accentIndex: number;
  testId: string;
}) {
  const accent = ADMIN_STAT_CARD_ACCENTS[accentIndex % ADMIN_STAT_CARD_ACCENTS.length];
  return (
    <div className={`${adminDashboardClasses.statCard} ${accent.ring}`} data-testid={testId}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={adminDashboardClasses.statCardTitle}>{title}</p>
          <p className={adminDashboardClasses.statCardValue}>{value.toLocaleString()}</p>
        </div>
        <span className={`${adminDashboardClasses.statCardIcon} ${accent.icon}`}>
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export function AdminDownloadUsagePage({ analyticsApi: analyticsApiProp }: AdminDownloadUsagePageProps = {}) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const analyticsApi = useMemo(
    () => analyticsApiProp ?? new HttpAdminDownloadUsageAnalyticsAdapter(getAccessToken),
    [analyticsApiProp, getAccessToken]
  );

  const [filter, setFilter] = useState<DownloadUsageAnalyticsFilter>(EMPTY_DOWNLOAD_USAGE_ANALYTICS_FILTER);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<DownloaderSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [aggregates, setAggregates] = useState<DownloadUsageAggregates>(EMPTY_AGGREGATES);
  const [visits, setVisits] = useState<VisitsVsDownloadsComparison>(EMPTY_VISITS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(0);
  }, [filter.gender, filter.ageGroup]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [downloaderPage, usage, comparison] = await Promise.all([
          analyticsApi.fetchDownloaders(filter, page, PAGE_SIZE),
          analyticsApi.fetchDownloadUsage(filter),
          analyticsApi.fetchVisitsVsDownloads(filter),
        ]);
        if (cancelled) {
          return;
        }
        setRows(downloaderPage.items);
        setTotalPages(downloaderPage.totalPages);
        setTotalElements(downloaderPage.totalElements);
        setAggregates(usage);
        setVisits(comparison);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setRows([]);
        setTotalPages(0);
        setTotalElements(0);
        setAggregates(EMPTY_AGGREGATES);
        setVisits(EMPTY_VISITS);
        setError(
          err instanceof ApiError || err instanceof Error
            ? err.message
            : 'Failed to load download usage analytics.'
        );
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
  }, [analyticsApi, filter, page]);

  return (
    <div className={adminDashboardClasses.page} data-testid="admin-download-usage-page">
      <AdminPageHeader
        eyebrow="Open data"
        title="Download usage analytics"
        description="See who downloads public datasets, filter by demographics, and compare site visitors with downloaders."
        icon={<Download className="h-7 w-7" aria-hidden="true" />}
        testId="admin-download-usage-header"
      />

      <AdminDownloadUsageFilterPanel filter={filter} onChange={setFilter} />

      {error ? (
        <div
          role="alert"
          data-testid="admin-download-usage-error"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Usage summary">
        <StatCard
          title="Downloaders"
          value={aggregates.totalDownloaders}
          accentIndex={0}
          testId="stat-total-downloaders"
        />
        <StatCard
          title="Downloads"
          value={aggregates.totalDownloads}
          accentIndex={1}
          testId="stat-total-downloads"
        />
        <StatCard
          title="Unique visitors"
          value={visits.totalUniqueVisitors}
          accentIndex={2}
          testId="stat-unique-visitors"
        />
        <StatCard
          title="Unique downloaders"
          value={visits.totalUniqueDownloaders}
          accentIndex={3}
          testId="stat-unique-downloaders"
        />
      </section>

      <section className={adminDashboardClasses.section} aria-labelledby="download-usage-charts-heading">
        <h2 id="download-usage-charts-heading" className={adminDashboardClasses.sectionHeading}>
          <Users className={adminDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Charts
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartPanel title="Downloaders by gender" testId="download-usage-gender-panel">
            <GenderSplitChart data={toGenderChartItems(aggregates.byGender)} />
          </ChartPanel>
          <ChartPanel title="Downloaders by age group" testId="download-usage-age-panel">
            <DownloadUsageAgeGroupChart data={toAgeGroupChartItems(aggregates.byAgeGroup)} />
          </ChartPanel>
          <ChartPanel title="Downloads by dataset" testId="download-usage-dataset-panel">
            <DownloadUsageDatasetChart data={aggregates.byDataset} />
          </ChartPanel>
          <ChartPanel title="Downloads over time" testId="download-usage-over-time-panel">
            <SubmissionsOverTimeChart data={toDownloadsOverTimeChartItems(aggregates.downloadsOverTime)} />
          </ChartPanel>
          <ChartPanel
            title="Visitors vs downloaders"
            testId="visits-vs-downloads-panel"
            className="lg:col-span-2"
          >
            <VisitsVsDownloadsChart data={visits.overTime} />
          </ChartPanel>
        </div>
      </section>

      <section className={adminDashboardClasses.section} aria-labelledby="downloaders-table-heading">
        <h2 id="downloaders-table-heading" className={adminDashboardClasses.sectionHeading}>
          <Download className={adminDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Downloaders
        </h2>
        <div className={adminDashboardClasses.contentCard}>
          <DownloaderTable
            rows={rows}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}
