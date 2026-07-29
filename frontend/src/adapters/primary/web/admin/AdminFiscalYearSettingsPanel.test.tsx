import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';
import { AdminFiscalYearSettingsPanel } from './AdminFiscalYearSettingsPanel';

const activeFiscalYear = {
  fiscalYearLabel: '2025/26',
  priorFiscalYearLabel: '2024/25',
  supportedLabels: ['2025/26', '2024/25', '2023/24'],
};

const fetchPublicActiveFiscalYearMock = vi.fn().mockResolvedValue(activeFiscalYear);
const setAdminActiveFiscalYearMock = vi.fn().mockResolvedValue({
  fiscalYearLabel: '2024/25',
  priorFiscalYearLabel: '2023/24',
  supportedLabels: ['2025/26', '2024/25', '2023/24'],
});

vi.mock('../../../secondary/api/fiscal-year-settings-api.adapter', () => ({
  fetchPublicActiveFiscalYear: () => fetchPublicActiveFiscalYearMock(),
  setAdminActiveFiscalYear: (...args: unknown[]) => setAdminActiveFiscalYearMock(...args),
}));

const authState = {
  getAccessToken: () => 'admin-token',
  checkSilentRefresh: vi.fn().mockResolvedValue(undefined),
};

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: Object.assign(
    (selector: (state: typeof authState) => unknown) => selector(authState),
    { getState: () => authState }
  ),
}));

describe('AdminFiscalYearSettingsPanel', () => {
  beforeEach(() => {
    fetchPublicActiveFiscalYearMock.mockClear();
    setAdminActiveFiscalYearMock.mockClear();
    authState.checkSilentRefresh.mockClear();
    fetchPublicActiveFiscalYearMock.mockResolvedValue(activeFiscalYear);
    setAdminActiveFiscalYearMock.mockResolvedValue({
      fiscalYearLabel: '2024/25',
      priorFiscalYearLabel: '2023/24',
      supportedLabels: ['2025/26', '2024/25', '2023/24'],
    });
  });

  it('loads the current fiscal year setting from the public settings API', async () => {
    render(<AdminFiscalYearSettingsPanel />);

    await waitFor(() => {
      expect(fetchPublicActiveFiscalYearMock).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText(/Current active fiscal year/i)).toHaveTextContent('FY 2025/26');
    });
  });

  it('calls PUT API and shows success when fiscal year is saved', async () => {
    const user = userEvent.setup();
    render(<AdminFiscalYearSettingsPanel />);

    const field = await screen.findByLabelText(/Current active fiscal year/i);
    await waitFor(() => expect(field).toHaveTextContent('FY 2025/26'));

    await chooseFormOptionByValue(user, /Current active fiscal year/i, '2024/25');
    await user.click(screen.getByRole('button', { name: /Save fiscal year/i }));

    await waitFor(() => {
      expect(authState.checkSilentRefresh).toHaveBeenCalledTimes(1);
      expect(setAdminActiveFiscalYearMock).toHaveBeenCalledWith('2024/25', 'admin-token');
      expect(screen.getByText(/Active fiscal year updated to 2024\/25/i)).toBeInTheDocument();
    });
  });
});
