import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BypForm } from './BypForm';

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

vi.mock('../../../../../core/submission-submit.service', () => ({
  submitSurvey: (...args: unknown[]) => enqueueMock(...args),
}));

vi.mock('../../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: { id: string } }) => unknown) =>
    selector({ user: { id: '22222222-2222-2222-2222-222222222222' } }),
}));

describe('BypForm', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders BYP sections in logical order (TC-FORM-02-01 partial)', () => {
    render(<BypForm />);

    expect(screen.getByText(/Beneficiary Young Person \(BYP\) Questionnaire/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name of respondent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Q1\. Fund receipt duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Q5\. PDC \/ Parish Chief service rating/i)).toBeInTheDocument();
    expect(screen.getByText(/Q8\. Did you receive business development services/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Q9\. Suggestions for improvement/i)).toBeInTheDocument();
  });

  it('shows specify field when Q1 is Months (specify) (TC-FORM-02-02)', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    await user.selectOptions(screen.getByLabelText(/Q1\. Fund receipt duration/i), 'MONTHS');
    expect(screen.getByLabelText(/Please specify duration/i)).toBeInTheDocument();
  });

  it('shows BDS checkboxes when Q8 is Yes and hides when No (TC-FORM-02-03)', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    const yes = document.getElementById('receivedBds-yes');
    expect(yes).toBeTruthy();
    await user.click(yes!);
    expect(screen.getByText(/Select services received/i)).toBeInTheDocument();

    const no = document.getElementById('receivedBds-no');
    await user.click(no!);
    expect(screen.queryByText(/Select services received/i)).not.toBeInTheDocument();
  });

  it('blocks submit when respondent name is blank (TC-FORM-02-04)', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    await user.click(screen.getByRole('button', { name: /Submit BYP Survey/i }));
    expect(enqueueMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Name of respondent is required/i)).toBeInTheDocument();
  });

  it('calls enqueue with a fresh deviceSubmissionId on valid submit', async () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .mockReturnValueOnce('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    render(<BypForm onSubmitted={onSubmitted} />);

    await user.type(screen.getByLabelText(/name of respondent/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/phone number/i), '0772111222');
    await user.selectOptions(screen.getByLabelText(/^gender/i), 'FEMALE');
    await user.selectOptions(screen.getByLabelText(/age group/i), 'AGE_20_24');
    await user.type(screen.getByLabelText(/exact age/i), '22');

    await waitFor(() => expect(document.getElementById('district')).not.toBeDisabled());
    await user.selectOptions(document.getElementById('district')!, 'district-1');
    await waitFor(() => expect(document.getElementById('subcounty')).not.toBeDisabled());
    await user.selectOptions(document.getElementById('subcounty')!, 'subcounty-1');
    await waitFor(() => expect(document.getElementById('parish')).not.toBeDisabled());
    await user.selectOptions(document.getElementById('parish')!, 'parish-1');
    await waitFor(() => expect(document.getElementById('village')).not.toBeDisabled());
    await user.selectOptions(document.getElementById('village')!, 'village-1');

    await user.selectOptions(screen.getByLabelText(/Q1\. Fund receipt duration/i), 'ONE_WEEK');
    await user.click(document.getElementById('receivedActualAmountRequested-yes')!);
    await user.type(screen.getByLabelText(/Q3\. Cash amount received/i), '500000');
    await user.selectOptions(screen.getByLabelText(/Q4\. Instalment period/i), 'MONTHLY');
    await user.selectOptions(screen.getByLabelText(/Q5\. PDC/i), 'VERY_GOOD');
    await user.selectOptions(screen.getByLabelText(/Q6\. PDM performance rating/i), 'GOOD');
    await user.click(document.getElementById('groupOrganizedTransparently-yes')!);
    await user.click(document.getElementById('receivedBds-yes')!);
    await user.click(screen.getByLabelText(/Training/i));
    await user.type(screen.getByLabelText(/Q9\. Suggestions for improvement/i), 'Provide more technical support.');

    await user.click(screen.getByRole('button', { name: /Submit BYP Survey/i }));

    expect(enqueueMock).toHaveBeenCalledTimes(1);
    expect(enqueueMock.mock.calls[0][0].deviceSubmissionId).toBe('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    expect(enqueueMock.mock.calls[0][0].payload.formType).toBe('BYP');
  }, 10_000);
});
