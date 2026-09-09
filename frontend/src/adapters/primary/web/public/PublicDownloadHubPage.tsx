import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Download,
  FileDown,
  FileSpreadsheet,
  Filter,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import type { LocationFields } from '../../../../core/domain/admin-location.model';
import {
  DOWNLOAD_SESSION_REJECTED_MESSAGE,
  isDownloadSessionRejectedStatus,
} from '../../../../core/domain/download-session-headers';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
} from '../../../../core/domain/form-validation.model';
import { formatFinancialYearPeriodLabel } from '../../../../core/financial-year-period';
import type { FinancialYearPeriodHalf } from '../../../../core/domain/financial-year-period.model';
import {
  PUBLIC_EXPORT_FORMAT_LABELS,
  type PublicExportFormat,
} from '../../../../core/domain/public-export.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import {
  emptyToolFieldDownloadFilter,
  parseToolDownloadDatasetParam,
  recentFinancialYearPeriodKeys,
  TOOL_DOWNLOAD_DATASET_OPTIONS,
  type ToolDownloadDataset,
  type ToolFieldDownloadFilter,
} from '../../../../core/domain/tool-field-download.model';
import { usePageMeta } from '../../../../core/hooks/usePageMeta';
import { PAGE_META } from '../../../../core/seo/site-meta';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import type { IPublicToolDownloadApiPort } from '../../../../ports/public-tool-download-api.port';
import { HttpPublicToolDownloadAdapter } from '../../../secondary/api/public-tool-download-api.adapter';
import { locationRepository } from '../../../secondary/location/location-repository.adapter';
import { CascadingLocationSelector } from '../components/CascadingLocationSelector';
import { FormField, FormSelect } from '../components/forms';
import {
  clearRejectedDownloadSession,
  useGatedPublicDownload,
} from './useGatedPublicDownload';

const PUBLIC_EXPORT_FORMATS: PublicExportFormat[] = ['csv', 'xlsx'];

const FORMAT_ICONS: Record<PublicExportFormat, typeof FileDown> = {
  csv: FileDown,
  xlsx: FileSpreadsheet,
};

function labelFromFinancialYearPeriodKey(key: string): string {
  const match = key.match(/^(JAN_JUN|JUL_DEC)_(\d+)$/);
  if (!match) {
    return key;
  }
  return formatFinancialYearPeriodLabel({
    period: match[1] as FinancialYearPeriodHalf,
    year: Number(match[2]),
  });
}

function hasActiveToolDownloadFilters(filter: ToolFieldDownloadFilter): boolean {
  return Boolean(
    filter.districtId ||
      filter.subcountyId ||
      filter.parishId ||
      filter.gender ||
      filter.ageGroup ||
      filter.financialYearPeriod
  );
}

export interface PublicDownloadHubPageProps {
  downloadApi?: IPublicToolDownloadApiPort;
  profileApi?: IDownloadProfileApiPort;
  locationRepository?: ILocationRepositoryPort;
}

export function PublicDownloadHubPage({
  downloadApi,
  profileApi,
  locationRepository: locationRepo = locationRepository,
}: PublicDownloadHubPageProps) {
  usePageMeta(PAGE_META.publicDownloadHub);

  const [searchParams, setSearchParams] = useSearchParams();
  const adapter = useMemo(() => downloadApi ?? new HttpPublicToolDownloadAdapter(), [downloadApi]);
  const { runWithDownloadSession, downloadProfileDialog } = useGatedPublicDownload(profileApi);

  const [selectedDataset, setSelectedDataset] = useState<ToolDownloadDataset | null>(() =>
    parseToolDownloadDatasetParam(searchParams.get('dataset'))
  );
  const [filter, setFilter] = useState<ToolFieldDownloadFilter>(emptyToolFieldDownloadFilter);
  const [financialYearPeriods] = useState(() => recentFinancialYearPeriodKeys());
  const [activeFormat, setActiveFormat] = useState<PublicExportFormat | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fromQuery = parseToolDownloadDatasetParam(searchParams.get('dataset'));
    setSelectedDataset(fromQuery);
  }, [searchParams]);

  const locationValue: LocationFields = useMemo(
    () => ({
      districtId: filter.districtId,
      subcountyId: filter.subcountyId,
      parishId: filter.parishId,
      villageId: '',
    }),
    [filter.districtId, filter.subcountyId, filter.parishId]
  );

  const selectDataset = (dataset: ToolDownloadDataset) => {
    setSelectedDataset(dataset);
    setError('');
    setSearchParams({ dataset }, { replace: true });
  };

  const clearFilters = () => {
    setFilter(emptyToolFieldDownloadFilter());
  };

  const handleDownload = (format: PublicExportFormat) => {
    if (!selectedDataset) {
      setError('Select a tool before downloading.');
      return;
    }

    setError('');
    void runWithDownloadSession(async (sessionToken) => {
      setActiveFormat(format);
      try {
        await adapter.downloadToolDataset(selectedDataset, format, filter, sessionToken);
      } catch (err) {
        if (err instanceof ApiError && isDownloadSessionRejectedStatus(err.status)) {
          clearRejectedDownloadSession();
          setError(DOWNLOAD_SESSION_REJECTED_MESSAGE);
        } else {
          setError(
            err instanceof ApiError || err instanceof Error
              ? err.message
              : 'Download failed. Please try again.'
          );
        }
      } finally {
        setActiveFormat(null);
      }
    });
  };

  const filtersActive = hasActiveToolDownloadFilters(filter);
  const downloadDisabled = !selectedDataset || activeFormat !== null;

  return (
    <div className={publicDashboardClasses.page} data-testid="public-download-hub-page">
      {downloadProfileDialog}

      <header className={publicDashboardClasses.hero} data-testid="public-download-hub-hero">
        <span className={publicDashboardClasses.heroAccent} aria-hidden="true" />
        <span className={publicDashboardClasses.heroGlow} aria-hidden="true" />
        <div className={publicDashboardClasses.heroContent}>
          <p className={publicDashboardClasses.heroEyebrow}>Open data</p>
          <h1 className={`${publicDashboardClasses.heroTitle} flex items-center gap-3`}>
            <Download className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
            Download field data
          </h1>
          <p className={publicDashboardClasses.heroLead}>
            Export anonymised questionnaire answers for one tool at a time. Choose filters if you need a
            narrower slice, then download CSV or Excel. A short profile is required once per visit.
          </p>
          <div className={publicDashboardClasses.heroBadges}>
            <span className={publicDashboardClasses.heroBadge}>
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" aria-hidden="true" />
              PII stripped
            </span>
            <span className={publicDashboardClasses.heroBadge}>One tool per file</span>
            <span className={publicDashboardClasses.heroBadge}>CSV &amp; Excel</span>
          </div>
        </div>
      </header>

      <section className={publicDashboardClasses.section} aria-labelledby="download-hub-tool-heading">
        <h2 id="download-hub-tool-heading" className={publicDashboardClasses.sectionHeading}>
          <Download className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Choose a tool
        </h2>
        <div
          className={`${publicDashboardClasses.panel} p-4 sm:p-5`}
          role="radiogroup"
          aria-label="Download tool"
          data-testid="public-download-hub-tool-picker"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {TOOL_DOWNLOAD_DATASET_OPTIONS.map((option) => {
              const selected = selectedDataset === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-testid={`download-hub-tool-${option.value}`}
                  onClick={() => selectDataset(option.value)}
                  className={[
                    'rounded-xl border px-4 py-3 text-left transition duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                    selected
                      ? 'border-brand/40 bg-brand-light/50 ring-1 ring-brand/20'
                      : 'border-border/80 bg-surface hover:border-brand/25 hover:bg-surface-muted/50',
                  ].join(' ')}
                >
                  <span className="block text-sm font-semibold text-text">{option.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={publicDashboardClasses.section} aria-labelledby="download-hub-filters-heading">
        <h2 id="download-hub-filters-heading" className={publicDashboardClasses.sectionHeading}>
          <Filter className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Optional filters
        </h2>
        <div
          className={`${publicDashboardClasses.panel} overflow-hidden`}
          data-testid="public-download-hub-filters"
        >
          <div className={publicDashboardClasses.panelHeader}>
            <p className={publicDashboardClasses.panelHeaderTitle}>Narrow the export</p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                data-testid="download-hub-filter-clear"
                className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-border/80 px-3 text-xs font-semibold text-text-muted transition hover:border-brand/30 hover:bg-brand-light/40 hover:text-brand"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className={`${publicDashboardClasses.panelInset} space-y-4`}>
            <CascadingLocationSelector
              value={locationValue}
              onChange={(next) =>
                setFilter((current) => ({
                  ...current,
                  districtId: next.districtId,
                  subcountyId: next.subcountyId,
                  parishId: next.parishId,
                }))
              }
              repository={locationRepo}
              includeVillage={false}
              required={false}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Gender" htmlFor="download-hub-gender">
                <FormSelect
                  id="download-hub-gender"
                  testId="download-hub-gender"
                  value={filter.gender}
                  onChange={(value) => setFilter((current) => ({ ...current, gender: value }))}
                  options={GENDER_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder="Select All"
                />
              </FormField>
              <FormField label="Age group" htmlFor="download-hub-age-group">
                <FormSelect
                  id="download-hub-age-group"
                  testId="download-hub-age-group"
                  value={filter.ageGroup}
                  onChange={(value) => setFilter((current) => ({ ...current, ageGroup: value }))}
                  options={AGE_GROUP_VALUES.map((value) => ({
                    value,
                    label: AGE_GROUP_LABELS[value],
                  }))}
                  placeholder="Select All"
                />
              </FormField>
              <FormField label="Financial year period" htmlFor="download-hub-financial-year">
                <FormSelect
                  id="download-hub-financial-year"
                  testId="download-hub-financial-year"
                  value={filter.financialYearPeriod}
                  onChange={(value) =>
                    setFilter((current) => ({ ...current, financialYearPeriod: value }))
                  }
                  options={financialYearPeriods.map((period) => ({
                    value: period,
                    label: labelFromFinancialYearPeriodKey(period),
                  }))}
                  placeholder="Select All"
                />
              </FormField>
            </div>
          </div>
        </div>
      </section>

      <section className={publicDashboardClasses.section} aria-labelledby="download-hub-formats-heading">
        <h2 id="download-hub-formats-heading" className={publicDashboardClasses.sectionHeading}>
          <FileDown className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Download format
        </h2>
        <div className={`${publicDashboardClasses.panel} p-4 sm:p-5`} data-testid="public-download-hub-formats">
          <p className="text-sm text-text-muted">
            {selectedDataset
              ? `Export ${TOOL_DOWNLOAD_DATASET_OPTIONS.find((o) => o.value === selectedDataset)?.label ?? selectedDataset} as:`
              : 'Select a tool above to enable downloads.'}
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {PUBLIC_EXPORT_FORMATS.map((format) => {
              const busy = activeFormat === format;
              const Icon = FORMAT_ICONS[format];
              const buttonClass =
                format === 'csv'
                  ? `${publicDashboardClasses.exportButton} ${publicDashboardClasses.exportButtonPrimary}`
                  : `${publicDashboardClasses.exportButton} ${publicDashboardClasses.exportButtonSecondary}`;

              return (
                <button
                  key={format}
                  type="button"
                  data-testid={`download-hub-export-${format}`}
                  disabled={downloadDisabled}
                  onClick={() => handleDownload(format)}
                  className={`${buttonClass} w-full sm:w-auto sm:min-w-[10rem]`}
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
          {error && (
            <p
              className="mt-4 inline-flex items-start gap-2 text-sm text-rose-600"
              role="alert"
              data-testid="download-hub-error"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
