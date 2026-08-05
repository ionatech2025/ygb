import { FormField } from '../components/forms/FormField';
import { FormSelect } from '../components/forms/FormSelect';
import {
  DOWNLOAD_USAGE_AGE_FILTER_OPTIONS,
  DOWNLOAD_USAGE_GENDER_FILTER_OPTIONS,
  type DownloadUsageAnalyticsFilter,
} from '../../../../core/domain/download-usage-analytics.model';
import { adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';

export interface AdminDownloadUsageFilterPanelProps {
  filter: DownloadUsageAnalyticsFilter;
  onChange: (next: DownloadUsageAnalyticsFilter) => void;
}

export function AdminDownloadUsageFilterPanel({
  filter,
  onChange,
}: AdminDownloadUsageFilterPanelProps) {
  return (
    <section
      className={adminDashboardClasses.contentCard}
      data-testid="admin-download-usage-filter-panel"
      aria-label="Download usage filters"
    >
      <div className={adminDashboardClasses.contentCardHeader}>
        <h2 className={adminDashboardClasses.contentCardTitle}>Filters</h2>
        <p className={adminDashboardClasses.contentCardSubtitle}>
          Narrow downloaders and charts by age bracket and gender.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Gender" htmlFor="download-usage-gender">
          <FormSelect
            id="download-usage-gender"
            value={filter.gender}
            onChange={(gender) => onChange({ ...filter, gender })}
            options={DOWNLOAD_USAGE_GENDER_FILTER_OPTIONS}
            testId="download-usage-filter-gender"
          />
        </FormField>
        <FormField label="Age group" htmlFor="download-usage-age-group">
          <FormSelect
            id="download-usage-age-group"
            value={filter.ageGroup}
            onChange={(ageGroup) => onChange({ ...filter, ageGroup })}
            options={DOWNLOAD_USAGE_AGE_FILTER_OPTIONS}
            testId="download-usage-filter-age-group"
          />
        </FormField>
      </div>
    </section>
  );
}
