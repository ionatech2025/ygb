import type { LgoBudgetAllocationDashboardFilter } from '../core/domain/lgo-budget-allocation-dashboard-filter.model';

export interface ILgoBudgetAllocationExportApiPort {
  downloadCsv(filter: LgoBudgetAllocationDashboardFilter): Promise<void>;
}
