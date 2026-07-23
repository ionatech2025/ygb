import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import type { ILgoBudgetAllocationApiPort } from '../../../../ports/lgo-budget-allocation-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { LgoBudgetAllocationForm } from './LgoBudgetAllocationForm';

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

const subcounty: AdminLocation = {
  id: 'subcounty-1',
  name: 'Central',
  parentId: 'district-1',
  level: 'SUBCOUNTY',
};

const parish: AdminLocation = {
  id: 'parish-1',
  name: 'Parish One',
  parentId: 'subcounty-1',
  level: 'PARISH',
};

const village: AdminLocation = {
  id: 'village-1',
  name: 'Village One',
  parentId: 'parish-1',
  level: 'VILLAGE',
};

function createMockRepository(): ILocationRepositoryPort {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level) => {
      if (level === 'DISTRICT') return [district];
      return [];
    }),
    findByParentId: vi.fn().mockImplementation(async (parentId) => {
      if (parentId === 'district-1') return [subcounty];
      if (parentId === 'subcounty-1') return [parish];
      if (parentId === 'parish-1') return [village];
      return [];
    }),
  };
}

function createMockApi(overrides: Partial<ILgoBudgetAllocationApiPort> = {}): ILgoBudgetAllocationApiPort {
  return {
    submit: vi.fn().mockResolvedValue({
      submissionId: 'sub-1',
      lbaId: 'lba-1',
      status: 'SYNCED',
    }),
    ...overrides,
  };
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name of respondent/i), 'District Health Officer');
  await user.type(screen.getByLabelText(/phone number/i), '0772555666');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'FEMALE');
  await user.selectOptions(screen.getByLabelText(/age group/i), 'AGE_30_AND_ABOVE');

  await user.selectOptions(await screen.findByLabelText(/^district/i), 'district-1');
  await user.selectOptions(await screen.findByLabelText(/sub-county \/ division/i), 'subcounty-1');
  await user.selectOptions(await screen.findByLabelText(/parish \/ ward/i), 'parish-1');
  await user.selectOptions(await screen.findByLabelText(/village \/ zone/i), 'village-1');

  await user.type(screen.getByLabelText('Amount (UGX)', { selector: '#allocation-health-amount' }), '1200000');
  await user.type(screen.getByLabelText(/allocation rationale/i), 'Health and education received the largest shares due to service delivery gaps.');
  await user.type(
    screen.getByLabelText(/budget recommendations/i),
    'Increase agriculture extension funding and climate resilience programmes.'
  );
}

describe('LgoBudgetAllocationForm', () => {
  it('renders allocation, rationale, and recommendation sections', () => {
    render(<LgoBudgetAllocationForm api={createMockApi()} locationRepository={createMockRepository()} />);

    expect(screen.getByTestId('lgo-budget-allocation-form')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-prior-year-allocations-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-rationale-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-recommendations-section')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /previous financial year allocations/i })).toBeInTheDocument();
  });

  it('blocks submit and shows validation errors when required groups are empty', async () => {
    const user = userEvent.setup();
    const api = createMockApi();

    render(<LgoBudgetAllocationForm api={api} locationRepository={createMockRepository()} />);
    await user.click(screen.getByRole('button', { name: /submit budget allocation interview/i }));

    expect(await screen.findByText(/at least one sector allocation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/please provide at least 10 characters/i).length).toBeGreaterThanOrEqual(1);
    expect(api.submit).not.toHaveBeenCalled();
  });

  it(
    'submits through the port when the form is valid',
    async () => {
    const user = userEvent.setup();
    const api = createMockApi();

    useAuthStore.setState({
      user: {
        id: '22222222-2222-2222-2222-222222222222',
        fullName: 'Field Collector',
        phoneNumber: '0771111111',
        role: 'DATA_COLLECTOR',
      },
      tokens: null,
      isAuthenticated: true,
      isInitialized: true,
    });

    render(<LgoBudgetAllocationForm api={api} locationRepository={createMockRepository()} />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /submit budget allocation interview/i }));

    await waitFor(() => {
      expect(api.submit).toHaveBeenCalledTimes(1);
    });

    const payload = vi.mocked(api.submit).mock.calls[0]![0];
    expect(payload.respondent.name).toBe('District Health Officer');
    expect(payload.priorYearAllocations.health).toEqual({ amount: 1_200_000 });
    expect(payload.rationale).toContain('Health and education');
    expect(payload.recommendations).toContain('agriculture extension');
    },
    15_000
  );
});
