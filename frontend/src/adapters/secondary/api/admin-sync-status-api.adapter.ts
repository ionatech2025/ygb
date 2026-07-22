import { apiFetch } from '../../../core/api/api-client';
import type { AdminReceiptStatus } from '../../../core/domain/admin-receipt-status.model';
import type { IAdminSyncStatusApiPort } from '../../../ports/admin-sync-status-api.port';

export class HttpAdminSyncStatusAdapter implements IAdminSyncStatusApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async fetchReceiptStatus(): Promise<AdminReceiptStatus> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    return apiFetch<AdminReceiptStatus>('/api/v1/admin/sync/receipt-status', { method: 'GET' }, token);
  }
}
