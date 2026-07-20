import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IypForm } from './IypForm';

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

async function fillRespondent(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name of respondent/i), 'Jane Doe');
  await user.type(screen.getByLabelText(/phone number/i), '0772111222');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'FEMALE');
  await user.selectOptions(screen.getByLabelText(/age group/i), 'AGE_20_24');

  await waitFor(() => expect(document.getElementById('district')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('district')!, 'district-1');
  await waitFor(() => expect(document.getElementById('subcounty')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('subcounty')!, 'subcounty-1');
  await waitFor(() => expect(document.getElementById('parish')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('parish')!, 'parish-1');
  await waitFor(() => expect(document.getElementById('village')).not.toBeDisabled());
  await user.selectOptions(document.getElementById('village')!, 'village-1');
}

describe('IypForm', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('Q1 = Unaware hides Q3 (TC-FORM-03-01)', async () => {
    const user = userEvent.setup();
    render(<IypForm />);

    await user.click(document.getElementById('awareOfPdm-no')!);
    expect(screen.queryByLabelText(/Q3\. Are you aware of the eligibility criteria/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Q2\. How did you get information about PDM/i)).not.toBeInTheDocument();
  });

  it('Q6 = No shows Q9, hides Q7/Q8 (TC-FORM-03-02)', async () => {
    const user = userEvent.setup();
    render(<IypForm />);

    await user.click(document.getElementById('awareOfPdm-yes')!);
    await user.click(screen.getByLabelText(/^Radio$/i));
    await user.click(document.getElementById('eligibleCriteriaAware-yes')!);
    await user.click(document.getElementById('appliedForFund-no')!);

    expect(screen.queryByLabelText(/Q7\. Did you access the fund/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Q8\. Narrate why the application/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Q9\. Reasons for not applying/i)).toBeInTheDocument();
  });

  it('Q6 = Yes, Q7 = No shows Q8 (TC-FORM-03-03)', async () => {
    const user = userEvent.setup();
    render(<IypForm />);

    await user.click(document.getElementById('awareOfPdm-yes')!);
    await user.click(screen.getByLabelText(/^Radio$/i));
    await user.click(document.getElementById('eligibleCriteriaAware-yes')!);
    await user.click(document.getElementById('appliedForFund-yes')!);
    await user.click(document.getElementById('accessedFund-no')!);

    expect(screen.getByLabelText(/Q8\. Narrate why the application/i)).toBeInTheDocument();
    expect(screen.queryByText(/Q9\. Reasons for not applying/i)).not.toBeInTheDocument();
  });

  it('limitation checkbox shows explanation field (TC-FORM-03-04)', async () => {
    const user = userEvent.setup();
    render(<IypForm />);

    await user.click(
      screen.getByLabelText(/Limitation in the amount applied for/i)
    );
    expect(screen.getByLabelText(/Explain the limitation in amount applied for/i)).toBeInTheDocument();
  });

  it('multiple checkboxes selectable on Q2 (TC-FORM-11-01)', async () => {
    const user = userEvent.setup();
    render(<IypForm />);

    await user.click(document.getElementById('awareOfPdm-yes')!);
    await user.click(screen.getByLabelText(/^Radio$/i));
    await user.click(screen.getByLabelText(/^Television$/i));
    await user.click(screen.getByLabelText(/Relatives \/ Friends/i));

    expect(screen.getByLabelText(/^Radio$/i)).toBeChecked();
    expect(screen.getByLabelText(/^Television$/i)).toBeChecked();
    expect(screen.getByLabelText(/Relatives \/ Friends/i)).toBeChecked();
  });

  it('clears Q9 when Q6 changes from No to Yes (TC-FORM-09-03)', async () => {
    const user = userEvent.setup();
    render(<IypForm />);

    await user.click(document.getElementById('awareOfPdm-yes')!);
    await user.click(screen.getByLabelText(/^Radio$/i));
    await user.click(document.getElementById('eligibleCriteriaAware-yes')!);
    await user.click(document.getElementById('appliedForFund-no')!);
    await user.click(screen.getByLabelText(/^Not eligible$/i));

    await user.click(document.getElementById('appliedForFund-yes')!);
    expect(screen.queryByText(/Q9\. Reasons for not applying/i)).not.toBeInTheDocument();
  });

  it('aware + applied + accessed path submits without Q8/Q9 (TC-FORM-03-05)', async () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .mockReturnValueOnce('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    render(<IypForm onSubmitted={onSubmitted} />);

    await fillRespondent(user);

    await user.click(document.getElementById('awareOfPdm-yes')!);
    await user.click(screen.getByLabelText(/^Radio$/i));
    await user.click(document.getElementById('eligibleCriteriaAware-yes')!);
    await user.click(document.getElementById('appliedForFund-yes')!);
    await user.click(document.getElementById('accessedFund-yes')!);

    expect(screen.queryByLabelText(/Q8\. Narrate why the application/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Q9\. Reasons for not applying/i)).not.toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/Suggestions for improvement/i),
      'Provide more community outreach sessions.'
    );

    await user.click(screen.getByRole('button', { name: /Submit IYP Survey/i }));

    await waitFor(
      () => {
        expect(enqueueMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 10_000 }
    );

    const payload = enqueueMock.mock.calls[0][0].payload;
    expect(payload.formType).toBe('IYP');
    expect(payload.awareOfPdm).toBe(true);
    expect(payload.appliedForFund).toBe(true);
    expect(payload.accessedFund).toBe(true);
    expect(payload.rejectionNarrative).toBeNull();
    expect(payload.reasonsForNotApplying).toBeNull();
  }, 15_000);
});
