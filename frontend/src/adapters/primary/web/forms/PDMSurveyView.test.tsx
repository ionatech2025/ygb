import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { PDMSurveyView } from './PDMSurveyView';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

const collectorUser = {
  id: '22222222-2222-2222-2222-222222222222',
  fullName: 'Field Collector',
  phoneNumber: '0771111111',
  role: 'DATA_COLLECTOR' as const,
};

const adminUser = {
  id: '11111111-1111-1111-1111-111111111111',
  fullName: 'Administrator',
  phoneNumber: '0770000000',
  role: 'ADMIN' as const,
};

describe('PDMSurveyView', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: collectorUser,
      tokens: null,
      isAuthenticated: true,
      isInitialized: true,
    });
  });

  afterEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.setState({ isInitialized: true });
  });

  it('lists exactly BYP, IYP, LGO, PC in that order (TC-FORM-01-01)', async () => {
    const user = userEvent.setup();
    render(<PDMSurveyView />);

    const categoryField = screen.getByLabelText(/respondent category/i);
    await user.click(categoryField);

    const options = within(document.getElementById('pdm-category-listbox')!).getAllByRole('radio');
    expect(options).toHaveLength(4);
    expect(options.map((option) => option.closest('label')?.textContent?.trim())).toEqual(
      FORM_TYPE_OPTIONS.map((option) => option.label)
    );
  });

  it('renders the IYP form slot when IYP is selected (TC-FORM-01-02)', async () => {
    const user = userEvent.setup();
    render(<PDMSurveyView />);

    await chooseFormOptionByValue(user, /respondent category/i, 'IYP');

    expect(screen.getByTestId('iyp-form')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Individual Young Person \(IYP\) Questionnaire/i })).toBeInTheDocument();
  });

  it('shows the admin lock screen instead of the category selector (TC-AUTH-04-01)', () => {
    useAuthStore.setState({ user: adminUser, isAuthenticated: true });

    render(<PDMSurveyView />);

    expect(screen.getByText('Survey Entry Point Disabled')).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: /Beneficiary Young Person \(BYP\)/i })).not.toBeInTheDocument();
  });

  it('returns to the category selector when Back is clicked', async () => {
    const user = userEvent.setup();
    render(<PDMSurveyView />);

    await chooseFormOptionByValue(user, /respondent category/i, 'IYP');
    expect(screen.getByTestId('iyp-form')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back to category selection/i }));

    expect(screen.queryByTestId('iyp-form')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/respondent category/i)).toBeInTheDocument();
  });
});
