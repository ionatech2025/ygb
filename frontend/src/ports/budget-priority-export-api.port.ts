import type { BudgetPriorityDashboardFilter } from '../core/domain/budget-priority-dashboard-filter.model';
import type { PublicExportFormat } from '../core/domain/public-export.model';

export interface IBudgetPriorityExportApiPort {
  downloadExport(format: PublicExportFormat, filter: BudgetPriorityDashboardFilter): Promise<void>;
}
