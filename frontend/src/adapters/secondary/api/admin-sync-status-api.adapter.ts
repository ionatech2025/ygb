import { apiFetch } from '../../../core/api/api-client';
import type { AdminReceiptStatus } from '../../../core/domain/admin-receipt-status.model';
import type { IAdminSyncStatusApiPort } from '../../../ports/admin-sync-status-api.port';

const DEFAULT_PAGE_SIZE = 25;

export class HttpAdminSyncStatusAdapter implements IAdminSyncStatusApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async fetchReceiptStatus(page = 0, size = DEFAULT_PAGE_SIZE): Promise<AdminReceiptStatus> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    return apiFetch<AdminReceiptStatus>(
      `/api/v1/admin/sync/receipt-status?${params.toString()}`,
      { method: 'GET' },
      token
    );
  }
}
