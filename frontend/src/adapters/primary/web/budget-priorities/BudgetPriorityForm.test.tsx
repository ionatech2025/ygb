import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import type { IBudgetPriorityApiPort } from '../../../../ports/budget-priority-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { BudgetPriorityForm } from './BudgetPriorityForm';

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

function createMockApi(): IBudgetPriorityApiPort {
  return {
    submit: vi.fn().mockResolvedValue({
      bpId: 'bp-1',
      status: 'SUBMITTED',
      section: 'health',
      financialYearPeriod: 'JAN_JUN_2026',
    }),
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

describe('BudgetPriorityForm', () => {
  it('renders demographics including phone and priority fields on load', async () => {
    render(
      <BudgetPriorityForm section="health" api={createMockApi()} locationRepository={createMockRepository()} />
    );

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

    render(
      <BudgetPriorityForm section="health" api={api} locationRepository={createMockRepository()} />
    );

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

  it('shows sector-specific priority options per section', () => {
    const { rerender } = render(
      <BudgetPriorityForm section="agriculture" api={createMockApi()} locationRepository={createMockRepository()} />
    );

    expect(screen.getByText(/irrigation and water for production/i)).toBeInTheDocument();

    rerender(
      <BudgetPriorityForm section="education" api={createMockApi()} locationRepository={createMockRepository()} />
    );

    expect(screen.getByText(/primary education infrastructure/i)).toBeInTheDocument();

    rerender(
      <BudgetPriorityForm section="climate" api={createMockApi()} locationRepository={createMockRepository()} />
    );

    expect(screen.getByText(/reforestation and tree planting/i)).toBeInTheDocument();
  });

  it('shows an error when submitting without priority areas', async () => {
    const user = userEvent.setup();
    render(
      <BudgetPriorityForm section="health" api={createMockApi()} locationRepository={createMockRepository()} />
    );

    await user.click(screen.getByRole('button', { name: /submit priorities/i }));

    expect(await screen.findByText(/select at least one priority area/i)).toBeInTheDocument();
  });
});
