import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearCachedPublicActiveFiscalYear,
  writeCachedPublicActiveFiscalYear,
} from '../../../../../adapters/secondary/api/fiscal-year-settings-api.adapter';
import { LgoForm } from './LgoForm';

vi.mock('../../../../../core/LocationService', () => ({
  locationService: { ensureLoaded: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock('../../../../../adapters/secondary/location/location-repository.adapter', () => ({
  locationRepository: {
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockResolvedValue([]),
    findByParentId: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../../../../../core/submission-submit.service', () => ({
  submitSurvey: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: { id: string }; isOnline: boolean }) => unknown) =>
    selector({ user: { id: '22222222-2222-2222-2222-222222222222' }, isOnline: false }),
}));

const CACHED_SETTING = {
  fiscalYearLabel: '2025/26',
  priorFiscalYearLabel: '2024/25',
  supportedLabels: ['2025/26', '2024/25', '2023/24', '2022/23'],
};

describe('LgoForm offline fiscal year', () => {
  beforeEach(() => {
    clearCachedPublicActiveFiscalYear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
  });

  afterEach(() => {
    clearCachedPublicActiveFiscalYear();
    vi.unstubAllGlobals();
  });

  it('renders Q1–3 from cache when the fiscal year fetch fails offline', async () => {
    writeCachedPublicActiveFiscalYear(CACHED_SETTING);

    render(<LgoForm />);

    await waitFor(() => {
      expect(screen.getByText(/Reporting for fiscal year:/i)).toHaveTextContent('2025/26');
      expect(screen.getByText('(a) Admin-set fiscal year')).toBeInTheDocument();
      expect(screen.getByText('(b) Prior fiscal year')).toBeInTheDocument();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/Failed to fetch/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit LGO Survey/i })).not.toBeDisabled();
  });

  it('shows a clear load error when offline and no fiscal year cache exists', async () => {
    render(<LgoForm />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/connect once while online/i);
    });

    expect(screen.queryByText(/Reporting for fiscal year:/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit LGO Survey/i })).toBeDisabled();
  });
});
