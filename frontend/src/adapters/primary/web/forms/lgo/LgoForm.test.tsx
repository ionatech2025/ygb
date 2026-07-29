import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const activeFiscalYear = {
  fiscalYearLabel: '2025/26',
  priorFiscalYearLabel: '2024/25',
  supportedLabels: ['2025/26', '2024/25', '2023/24', '2022/23'],
};

const fetchPublicActiveFiscalYearMock = vi.fn().mockResolvedValue(activeFiscalYear);

vi.mock('../../../../../adapters/secondary/api/fiscal-year-settings-api.adapter', () => ({
  fetchPublicActiveFiscalYear: () => fetchPublicActiveFiscalYearMock(),
}));

const enqueueMock = vi.fn().mockResolvedValue(1);

vi.mock('../../../../../core/submission-submit.service', () => ({
  submitSurvey: (...args: unknown[]) => enqueueMock(...args),
}));

vi.mock('../../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: { id: string }; isOnline: boolean }) => unknown) =>
    selector({ user: { id: '22222222-2222-2222-2222-222222222222' }, isOnline: true }),
}));

async function fillRespondent(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name of respondent/i), 'Official Name');
  await user.type(screen.getByLabelText(/phone number/i), '0772111444');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'FEMALE');
  await user.selectOptions(screen.getByLabelText(/age group/i), 'AGE_ABOVE_35');

  await waitFor(() => expect(document.getElementById('district')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('district')!, 'district-1');
  await waitFor(() => expect(document.getElementById('subcounty')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('subcounty')!, 'subcounty-1');
  await waitFor(() => expect(document.getElementById('parish')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('parish')!, 'parish-1');
  await waitFor(() => expect(document.getElementById('village')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('village')!, 'village-1');
}

async function waitForFiscalYearBlocks() {
  await waitFor(() => {
    expect(screen.getByText(/Reporting for fiscal year:/i)).toHaveTextContent('2025/26');
    expect(screen.getByText('(a) Admin-set fiscal year')).toBeInTheDocument();
    expect(screen.getByText('(b) Prior fiscal year')).toBeInTheDocument();
  });
}

async function fillFiscalYearBlock(user: ReturnType<typeof userEvent.setup>, fy: string) {
  const slug = fy.replace('/', '-');
  await user.type(document.getElementById(`expectedFunds-${slug}`)!, '1000000');
  await user.type(document.getElementById(`actualFunds-${slug}`)!, '900000');
  await user.type(document.getElementById(`totalBeneficiaryCount-${slug}`)!, '50');
  await user.type(document.getElementById(`beneficiariesUnder30Count-${slug}`)!, '20');
  await user.type(document.getElementById(`beneficiaryYoungWomenCount-${slug}`)!, '12');
  await user.type(document.getElementById(`beneficiaryYoungMenCount-${slug}`)!, '8');
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
    fetchPublicActiveFiscalYearMock.mockClear();
    fetchPublicActiveFiscalYearMock.mockResolvedValue(activeFiscalYear);
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('loads admin fiscal year and renders two FY blocks with (a)/(b) labels', async () => {
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    expect(screen.queryByLabelText(/^Fiscal year/i)).not.toBeInTheDocument();
    expect(fetchPublicActiveFiscalYearMock).toHaveBeenCalledTimes(1);
  });

  it('shows young men count field in each FY block', async () => {
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    expect(document.getElementById('beneficiaryYoungMenCount-2025-26')).toBeInTheDocument();
    expect(document.getElementById('beneficiaryYoungMenCount-2024-25')).toBeInTheDocument();
  });

  it('uses sub-letter labels for grouped Q1–Q3 fields in each FY block', async () => {
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    expect(screen.getAllByLabelText(/Q1\(a\)\. Expected PDM funds received/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q1\(b\)\. Actual PDM funds received/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q2\(a\)\. Total beneficiaries from the PDM fund/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q2\(b\)\. Beneficiaries under 30/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q2\(c\)\. Beneficiary young women under 30/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q2\(d\)\. Beneficiary young men under 30/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q3\(a\)\. Total parishes in the district/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q3\(b\)\. Parishes that received PDM funds/i)).toHaveLength(2);
  });

  it('uses parish labels that distinguish district total vs funded parishes', async () => {
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    expect(screen.getAllByLabelText(/Q3\(a\)\. Total parishes in the district/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Q3\(b\)\. Parishes that received PDM funds/i)).toHaveLength(2);
  });

  it('does not let collectors change the admin-selected fiscal year', async () => {
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    expect(screen.queryByRole('combobox', { name: /fiscal year/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'FY 2024/25' })).not.toBeInTheDocument();
  });

  it('renders updated Q4–Q7 governance questions', async () => {
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    expect(
      screen.getByLabelText(/Q4\. Is the central government's commitment to PDM reflected/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Q5\. Is enough fund being allocated/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Q6\. Should there be an increment in allocation/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Q7\. Are resources distributed equitably according to the size of population/i)
    ).toBeInTheDocument();
  });

  it('Q8 = No shows explain field and blocks submit if empty (TC-FORM-04-02)', async () => {
    const user = userEvent.setup();
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    await fillRespondent(user);
    await fillFiscalYearBlock(user, '2025/26');
    await fillFiscalYearBlock(user, '2024/25');
    await fillGovernanceQuestions(user);

    await user.click(document.getElementById('fundsSpentAsRequired-no')!);
    await user.click(document.getElementById('economicTransformation-yes')!);
    await user.type(
      screen.getByLabelText(/Q10\. What do you think should be improved/i),
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

    await waitForFiscalYearBlocks();
    await fillRespondent(user);
    await user.type(document.getElementById('expectedFunds-2025-26')!, 'abc');

    await user.click(screen.getByRole('button', { name: /Submit LGO Survey/i }));
    expect(enqueueMock).not.toHaveBeenCalled();
    expect(document.getElementById('expectedFunds-2025-26-error')).toHaveTextContent(/Enter a valid numeric amount/i);
  }, 15_000);

  it('Q8/Q9 = Yes path submits two fiscal year records (TC-FORM-04-04)', async () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .mockReturnValueOnce('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    const user = userEvent.setup();
    render(<LgoForm />);

    await waitForFiscalYearBlocks();
    await fillRespondent(user);
    await fillFiscalYearBlock(user, '2025/26');
    await fillFiscalYearBlock(user, '2024/25');
    await fillGovernanceQuestions(user);

    await user.click(document.getElementById('fundsSpentAsRequired-yes')!);
    await user.click(document.getElementById('economicTransformation-yes')!);

    await user.type(
      screen.getByLabelText(/Q10\. What do you think should be improved/i),
      'Provide more monitoring tools for local governments.'
    );

    await user.click(screen.getByRole('button', { name: /Submit LGO Survey/i }));

    await waitFor(() => expect(enqueueMock).toHaveBeenCalledTimes(1), { timeout: 15_000 });

    const payload = enqueueMock.mock.calls[0][0].payload;
    expect(payload.formType).toBe('LGO');
    expect(payload.fiscalYearRecords).toHaveLength(2);
    expect(payload.fiscalYearRecords[0].fiscalYearLabel).toBe('2025/26');
    expect(payload.fiscalYearRecords[1].fiscalYearLabel).toBe('2024/25');
    expect(payload.fiscalYearRecords[0].beneficiaryYoungMenCount).toBe(8);
    expect(payload.fundsSpentExplanation).toBeNull();
    expect(payload.economicTransformationExplanation).toBeNull();
  }, 30_000);
});
