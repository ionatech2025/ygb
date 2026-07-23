import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../../core/api/api-client';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import type { IBudgetPriorityApiPort } from '../../../../ports/budget-priority-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { BudgetPriorityForm } from './BudgetPriorityForm';
import { BudgetPrioritySuccessPage } from './BudgetPrioritySuccessPage';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    getLoadError: vi.fn().mockReturnValue(null),
  },
}));

const district: AdminLocation = {
  id: 'district-1',
  name: 'Kampala',
  parentId: null,
  level: 'DISTRICT',
};

function createMockRepository(): ILocationRepositoryPort {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level) => (level === 'DISTRICT' ? [district] : [])),
    findByParentId: vi.fn().mockResolvedValue([]),
  };
}

function createMockApi(overrides: Partial<IBudgetPriorityApiPort> = {}): IBudgetPriorityApiPort {
  return {
    submit: vi.fn().mockResolvedValue({
      bpId: 'bp-1',
      status: 'SUBMITTED',
      section: 'health',
      financialYearPeriod: 'JAN_JUN_2026',
    }),
    ...overrides,
  };
}

async function fillValidHealthForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Citizen');
  await user.type(screen.getByLabelText(/phone number/i), '0772123456');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'FEMALE');
  await user.selectOptions(screen.getByLabelText(/age group/i), 'AGE_20_24');

  const districtSelect = await screen.findByTestId('budget-priority-district-select');
  await user.selectOptions(districtSelect, 'district-1');

  await user.click(screen.getByLabelText(/primary health care/i));
}

function renderForm(api: IBudgetPriorityApiPort) {
  return render(
    <MemoryRouter initialEntries={['/budget-priorities/health']}>
      <Routes>
        <Route
          path="/budget-priorities/:section"
          element={<BudgetPriorityForm section="health" api={api} locationRepository={createMockRepository()} />}
        />
        <Route path="/budget-priorities/:section/success" element={<BudgetPrioritySuccessPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BudgetPriorityForm', () => {
  it('renders demographics including phone and priority fields on load', async () => {
    renderForm(createMockApi());

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age group/i)).toBeInTheDocument();
    expect(await screen.findByTestId('budget-priority-district-select')).toBeInTheDocument();
    expect(screen.getByText(/primary health care/i)).toBeInTheDocument();
  });

  it('submits through the adapter with section and demographics.phoneNumber', async () => {
    const user = userEvent.setup();
    const api = createMockApi();

    renderForm(api);

    await fillValidHealthForm(user);
    await user.click(screen.getByRole('button', { name: /submit priorities/i }));

    await waitFor(() => {
      expect(api.submit).toHaveBeenCalledTimes(1);
    });

    const [section, payload] = vi.mocked(api.submit).mock.calls[0]!;
    expect(section).toBe('health');
    expect(payload.demographics.phoneNumber).toBe('0772123456');
    expect(payload.priorityAreas.rankedAreas).toContain('PRIMARY_HEALTH_CARE');
  });

  it('navigates to the success view with the submitted section name', async () => {
    const user = userEvent.setup();
    renderForm(createMockApi());

    await fillValidHealthForm(user);
    await user.click(screen.getByRole('button', { name: /submit priorities/i }));

    expect(await screen.findByTestId('budget-priority-success-page')).toBeInTheDocument();
    expect(screen.getByText(/Health Sector/i)).toBeInTheDocument();
    expect(screen.queryByTestId('budget-priority-form')).not.toBeInTheDocument();
  });

  it('shows duplicate block UI without success message on 409 (TC-BP-01-02)', async () => {
    const user = userEvent.setup();
    const api = createMockApi({
      submit: vi.fn().mockRejectedValue(new ApiError('Duplicate submission', 409)),
    });

    renderForm(api);

    await fillValidHealthForm(user);
    await user.click(screen.getByRole('button', { name: /submit priorities/i }));

    const duplicateBlock = await screen.findByTestId('budget-priority-duplicate-block');
    expect(duplicateBlock).toHaveTextContent(/Health/i);
    expect(duplicateBlock).toHaveTextContent(/one submission per sector/i);
    expect(screen.queryByTestId('budget-priority-success-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('budget-priority-form')).toBeInTheDocument();
  });

  it('shows sector-specific priority options per section', () => {
    const { rerender } = render(
      <MemoryRouter>
        <BudgetPriorityForm section="agriculture" api={createMockApi()} locationRepository={createMockRepository()} />
      </MemoryRouter>
    );

    expect(screen.getByText(/irrigation and water for production/i)).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <BudgetPriorityForm section="education" api={createMockApi()} locationRepository={createMockRepository()} />
      </MemoryRouter>
    );

    expect(screen.getByText(/primary education infrastructure/i)).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <BudgetPriorityForm section="climate" api={createMockApi()} locationRepository={createMockRepository()} />
      </MemoryRouter>
    );

    expect(screen.getByText(/reforestation and tree planting/i)).toBeInTheDocument();
  });

  it('shows an error when submitting without priority areas', async () => {
    const user = userEvent.setup();
    renderForm(createMockApi());

    await user.click(screen.getByRole('button', { name: /submit priorities/i }));

    expect(await screen.findByText(/select at least one priority area/i)).toBeInTheDocument();
  });

  it('shows validation alert for server 400 responses', async () => {
    const user = userEvent.setup();
    const api = createMockApi({
      submit: vi.fn().mockRejectedValue(new ApiError('Invalid Uganda phone number: 12345', 400)),
    });

    renderForm(api);

    await fillValidHealthForm(user);
    await user.click(screen.getByRole('button', { name: /submit priorities/i }));

    expect(await screen.findByTestId('budget-priority-error-alert')).toBeInTheDocument();
    expect(screen.getByText(/Invalid Uganda phone number/i)).toBeInTheDocument();
  });
});
