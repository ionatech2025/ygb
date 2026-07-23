import type { PublicDashboardFilter } from '../core/domain/public-dashboard-filter.model';
import type { PublicExportFormat } from '../core/domain/public-export.model';

export interface IPublicExportApiPort {
  downloadExport(format: PublicExportFormat, filter: PublicDashboardFilter): Promise<void>;
}
