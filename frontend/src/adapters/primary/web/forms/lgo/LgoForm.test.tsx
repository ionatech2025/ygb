import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LGO_FISCAL_YEAR_LABELS } from '../../../../../core/domain/lgo-form.model';
import { LgoForm } from './LgoForm';

vi.mock('../../../../../core/LocationService', () => ({
  locationService: { ensureLoaded: vi.fn().mockResolvedValue(undefined) },
}));

const locations = {
  district: { id: 'district-1', name: 'Kampala', parentId: null, level: 'DISTRICT' as const },
  subcounty: { id: 'subcounty-1', name: 'Central', parentId: 'district-1', level: 'SUBCOUNTY' as const },
  parish: { id: 'parish-1', name: 'Parish A', parentId: 'subcounty-1', level: 'PARISH' as const },
  village: { id: 'village-1', name: 'Village A', parentId: 'parish-1', level: 'VILLAGE' as const },
};

vi.mock('../../../../../adapters/secondary/location/location-repository.adapter', () => ({
  locationRepository: {
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level: string) =>
      level === 'DISTRICT' ? [locations.district] : []
    ),
    findByParentId: vi.fn().mockImplementation(async (parentId: string) => {
      if (parentId === locations.district.id) return [locations.subcounty];
      if (parentId === locations.subcounty.id) return [locations.parish];
      if (parentId === locations.parish.id) return [locations.village];
      return [];
    }),
  },
}));

const enqueueMock = vi.fn().mockResolvedValue(1);

vi.mock('../../../../secondary/submission/submission-queue.adapter', () => ({
  submissionQueue: { enqueue: (...args: unknown[]) => enqueueMock(...args) },
}));

vi.mock('../../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: { id: string } }) => unknown) =>
    selector({ user: { id: '22222222-2222-2222-2222-222222222222' } }),
}));

async function fillRespondent(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name of respondent/i), 'Official Name');
  await user.type(screen.getByLabelText(/phone number/i), '0772111444');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'FEMALE');
  await user.selectOptions(screen.getByLabelText(/age group/i), 'AGE_30_AND_ABOVE');

  await waitFor(() => expect(document.getElementById('district')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('district')!, 'district-1');
  await waitFor(() => expect(document.getElementById('subcounty')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('subcounty')!, 'subcounty-1');
  await waitFor(() => expect(document.getElementById('parish')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('parish')!, 'parish-1');
  await waitFor(() => expect(document.getElementById('village')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('village')!, 'village-1');
}

async function selectFiscalYear(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.selectOptions(screen.getByLabelText(/^Fiscal year/i), label);
}

async function fillSelectedFiscalYear(user: ReturnType<typeof userEvent.setup>, fy: string) {
  const slug = fy.replace('/', '-');
  await user.type(screen.getByLabelText(new RegExp(`Expected funds \\(FY ${fy.replace('/', '\\/')}\\)`, 'i')), '1000000');
  await user.type(
    screen.getByLabelText(new RegExp(`Actual funds received \\(FY ${fy.replace('/', '\\/')}\\)`, 'i')),
    '900000'
  );
  await user.type(document.getElementById(`totalBeneficiaryCount-${slug}`)!, '50');
  await user.type(document.getElementById(`youngPeopleCount-${slug}`)!, '20');
  await user.type(document.getElementById(`youngWomenCount-${slug}`)!, '15');
  await user.type(document.getElementById(`totalParishesCount-${slug}`)!, '10');
  await user.type(document.getElementById(`fundedParishesCount-${slug}`)!, '8');
}

async function fillGovernanceQuestions(user: ReturnType<typeof userEvent.setup>) {
  await user.click(document.getElementById('fundsAllocatedEquitably-yes')!);
  await user.click(document.getElementById('allocatedFundsSufficient-yes')!);
  await user.click(document.getElementById('adequateUtilisationOversight-yes')!);
  await user.click(document.getElementById('transparentBeneficiarySelection-yes')!);
}

describe('LgoForm', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('shows fiscal year dropdown with options through FY2029/30 (TC-FORM-04-01)', () => {
    render(<LgoForm />);

    const dropdown = screen.getByLabelText(/^Fiscal year/i);
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'FY 2022/23' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'FY 2029/30' })).toBeInTheDocument();
    expect(LGO_FISCAL_YEAR_LABELS).toHaveLength(8);
    expect(screen.queryByLabelText(/Expected funds \(FY 2022\/23\)/i)).not.toBeInTheDocument();
  });

  it('reveals Expected/Actual inputs only after a fiscal year is selected', async () => {
    const user = userEvent.setup();
    render(<LgoForm />);

    await selectFiscalYear(user, '2023/24');

    expect(screen.getByLabelText(/Expected funds \(FY 2023\/24\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Actual funds received \(FY 2023\/24\)/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Expected funds \(FY 2022\/23\)/i)).not.toBeInTheDocument();
  });

  it('renders Q4–Q7 governance questions', () => {
    render(<LgoForm />);

    expect(screen.getByLabelText(/Q4\. Were PDM funds allocated equitably/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Q5\. Were the allocated funds sufficient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Q6\. Was there adequate oversight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Q7\. Were beneficiary selection processes transparent/i)).toBeInTheDocument();
  });

  it('Q8 = No shows explain field and blocks submit if empty (TC-FORM-04-02)', async () => {
    const user = userEvent.setup();
    render(<LgoForm />);

    await fillRespondent(user);
    await selectFiscalYear(user, '2022/23');
    await fillSelectedFiscalYear(user, '2022/23');
    await fillGovernanceQuestions(user);

    await user.click(document.getElementById('fundsSpentAsRequired-no')!);
    await user.click(document.getElementById('economicTransformation-yes')!);
    await user.type(
      screen.getByLabelText(/Q10\. Suggestions for improvement/i),
      'Provide more monitoring tools for local governments.'
    );

    expect(screen.getByLabelText(/Explain why funds were not spent as required/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Submit LGO Survey/i }));
    expect(enqueueMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Please provide at least 10 characters/i)).toBeInTheDocument();
  }, 30_000);

  it('non-numeric fund input blocked with inline error (TC-FORM-04-03)', async () => {
    const user = userEvent.setup();
    render(<LgoForm />);

    await fillRespondent(user);
    await selectFiscalYear(user, '2022/23');
    await user.type(screen.getByLabelText(/Expected funds \(FY 2022\/23\)/i), 'abc');

    await user.click(screen.getByRole('button', { name: /Submit LGO Survey/i }));
    expect(enqueueMock).not.toHaveBeenCalled();
    expect(document.getElementById('expectedFunds-2022-23-error')).toHaveTextContent(/Enter a valid numeric amount/i);
  }, 15_000);

  it('Q8/Q9 = Yes path submits a single selected fiscal year record (TC-FORM-04-04)', async () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .mockReturnValueOnce('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    const user = userEvent.setup();
    render(<LgoForm />);

    await fillRespondent(user);
    await selectFiscalYear(user, '2024/25');
    await fillSelectedFiscalYear(user, '2024/25');
    await fillGovernanceQuestions(user);

    await user.click(document.getElementById('fundsSpentAsRequired-yes')!);
    await user.click(document.getElementById('economicTransformation-yes')!);

    await user.type(
      screen.getByLabelText(/Q10\. Suggestions for improvement/i),
      'Provide more monitoring tools for local governments.'
    );

    await user.click(screen.getByRole('button', { name: /Submit LGO Survey/i }));

    await waitFor(() => expect(enqueueMock).toHaveBeenCalledTimes(1), { timeout: 15_000 });

    const payload = enqueueMock.mock.calls[0][0].payload;
    expect(payload.formType).toBe('LGO');
    expect(payload.fiscalYearRecords).toHaveLength(1);
    expect(payload.fiscalYearRecords[0].fiscalYearLabel).toBe('2024/25');
    expect(payload.fundsSpentExplanation).toBeNull();
    expect(payload.economicTransformationExplanation).toBeNull();
  }, 30_000);
});
