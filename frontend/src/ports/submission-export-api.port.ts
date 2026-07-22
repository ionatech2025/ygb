import type { DashboardFilter } from '../core/domain/dashboard-filter.model';
import type { ExportFormat } from '../core/domain/export.model';

export interface ISubmissionExportApiPort {
  downloadExport(format: ExportFormat, filter: DashboardFilter): Promise<void>;
}
