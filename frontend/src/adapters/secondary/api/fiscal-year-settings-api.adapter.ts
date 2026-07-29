import { apiFetch } from '../../../core/api/api-client';
import type { ActiveFiscalYearSetting } from '../../../core/domain/active-fiscal-year.model';

export async function fetchPublicActiveFiscalYear(): Promise<ActiveFiscalYearSetting> {
  return apiFetch<ActiveFiscalYearSetting>('/api/v1/public/settings/fiscal-year', { method: 'GET' });
}

export async function fetchAdminActiveFiscalYear(accessToken: string): Promise<ActiveFiscalYearSetting> {
  return apiFetch<ActiveFiscalYearSetting>(
    '/api/v1/admin/settings/fiscal-year',
    { method: 'GET' },
    accessToken
  );
}

export async function setAdminActiveFiscalYear(
  fiscalYearLabel: string,
  accessToken: string
): Promise<ActiveFiscalYearSetting> {
  return apiFetch<ActiveFiscalYearSetting>(
    '/api/v1/admin/settings/fiscal-year',
    {
      method: 'PUT',
      body: JSON.stringify({ fiscalYearLabel }),
    },
    accessToken
  );
}
