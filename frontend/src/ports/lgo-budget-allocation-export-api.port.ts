import type { LgoBudgetAllocationDashboardFilter } from '../core/domain/lgo-budget-allocation-dashboard-filter.model';

export interface ILgoBudgetAllocationExportApiPort {
  downloadCsv(filter: LgoBudgetAllocationDashboardFilter, sessionToken: string): Promise<void>;
}
