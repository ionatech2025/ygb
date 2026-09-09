import type { PublicExportFormat } from '../core/domain/public-export.model';
import type {
  ToolDownloadDataset,
  ToolFieldDownloadFilter,
} from '../core/domain/tool-field-download.model';

export interface IPublicToolDownloadApiPort {
  downloadToolDataset(
    dataset: ToolDownloadDataset,
    format: PublicExportFormat,
    filter: ToolFieldDownloadFilter,
    sessionToken: string
  ): Promise<void>;
}
