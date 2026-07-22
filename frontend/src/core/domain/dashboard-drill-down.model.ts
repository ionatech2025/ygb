import type { DashboardChartDrillDownEvent } from './dashboard-charts.model';
import type { DashboardFilter } from './dashboard-filter.model';
import { applyDashboardFilterPatch } from './dashboard-filter.model';

/** Applies a chart segment drill-down onto the current dashboard filter. */
export function applyChartDrillDown(
  filter: DashboardFilter,
  event: DashboardChartDrillDownEvent
): DashboardFilter {
  switch (event.dimension) {
    case 'district':
      return applyDashboardFilterPatch(filter, {
        districtId: event.value,
        subcountyId: '',
        parishId: '',
      });
    case 'gender':
      return applyDashboardFilterPatch(filter, {
        gender: event.value as DashboardFilter['gender'],
      });
    case 'date':
      return applyDashboardFilterPatch(filter, {
        dateFrom: event.value,
        dateTo: event.value,
      });
    default:
      return filter;
  }
}

export function buildSubmissionListSearch(filter: DashboardFilter, page = 0): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value) {
      params.set(key, value);
    }
  }
  if (page > 0) {
    params.set('page', String(page));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}
