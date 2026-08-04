import { apiFetch } from '../../../core/api/api-client';
import { isNetworkAuthFailure } from '../../../core/domain/auth-network';
import type { ActiveFiscalYearSetting } from '../../../core/domain/active-fiscal-year.model';

const PUBLIC_FISCAL_YEAR_CACHE_KEY = 'ygb-public-active-fiscal-year';

function isValidSetting(value: unknown): value is ActiveFiscalYearSetting {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as ActiveFiscalYearSetting;
  return (
    typeof candidate.fiscalYearLabel === 'string' &&
    candidate.fiscalYearLabel.length > 0 &&
    (candidate.priorFiscalYearLabel === null || typeof candidate.priorFiscalYearLabel === 'string') &&
    Array.isArray(candidate.supportedLabels)
  );
}

export function readCachedPublicActiveFiscalYear(): ActiveFiscalYearSetting | null {
  try {
    const raw = localStorage.getItem(PUBLIC_FISCAL_YEAR_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isValidSetting(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCachedPublicActiveFiscalYear(setting: ActiveFiscalYearSetting): void {
  localStorage.setItem(PUBLIC_FISCAL_YEAR_CACHE_KEY, JSON.stringify(setting));
}

export function clearCachedPublicActiveFiscalYear(): void {
  localStorage.removeItem(PUBLIC_FISCAL_YEAR_CACHE_KEY);
}

export async function fetchPublicActiveFiscalYear(): Promise<ActiveFiscalYearSetting> {
  try {
    const setting = await apiFetch<ActiveFiscalYearSetting>('/api/v1/public/settings/fiscal-year', {
      method: 'GET',
    });
    writeCachedPublicActiveFiscalYear(setting);
    return setting;
  } catch (error) {
    if (isNetworkAuthFailure(error)) {
      const cached = readCachedPublicActiveFiscalYear();
      if (cached) {
        return cached;
      }
    }
    throw error;
  }
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
