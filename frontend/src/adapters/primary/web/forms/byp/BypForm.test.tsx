import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DuplicateRespondentError } from '../../../../../core/duplicate-respondent.error';
import { buildBypSubmissionPayload } from '../../../../../core/byp-validation';
import { EMPTY_BYP_FIELDS } from '../../../../../core/domain/byp-form.model';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../../core/domain/respondent-fields.model';
import { BypForm } from './BypForm';
import { chooseFormOptionById, chooseFormOptionByValue } from '../../../../../test-utils/choose-form-option';

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
    expect(screen.getByLabelText(/Q1\. How long did it take you to receive your funds/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Q5\. How would you rate the quality of services provided by the Parish Chief/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Q8\. Did you receive any business development services\? If yes, specify/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Q9\. What do you think should be improved to make the PDM programme efficient and effective/i)
    ).toBeInTheDocument();
  });

  it('Q4 asks how long it took to receive PDM funds after applying', () => {
    render(<BypForm />);

    expect(
      screen.getByLabelText(/Q4\. How long did it take you to receive the PDM funds after you applied/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/What did you use the money for/i)).toBeInTheDocument();
  });

  it('Q5 spells out Parish Development Committee', () => {
    render(<BypForm />);

    expect(screen.getByLabelText(/Parish Development Committee \(PDC\)/i)).toBeInTheDocument();
  });

  it('shows loan repayment duration when the loan has been repaid', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    expect(screen.queryByLabelText(/How long did it take you to repay/i)).not.toBeInTheDocument();
    await user.click(document.getElementById('loanRepaid-yes')!);
    expect(screen.getByLabelText(/How long did it take you to repay/i)).toBeInTheDocument();
  });

  it('Q8 shows multi-select hint when business development services are received', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    await user.click(document.getElementById('receivedBds-yes')!);
    expect(screen.getByText(/\(select all that apply\)/i)).toBeInTheDocument();
  });

  it('shows specify field when Q1 is Months (specify) (TC-FORM-02-02)', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    await chooseFormOptionByValue(
      user,
      /Q1\. How long did it take you to receive your funds/i,
      'MONTHS'
    );
    expect(screen.getByLabelText(/Please specify how long it took to receive your funds/i)).toBeInTheDocument();
  });

  it('shows BDS checkboxes when Q8 is Yes and hides when No (TC-FORM-02-03)', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    const yes = document.getElementById('receivedBds-yes');
    expect(yes).toBeTruthy();
    await user.click(yes!);
    expect(screen.getByText(/Select the business development services you received/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Others \(specify\)$/i)).toBeInTheDocument();

    const no = document.getElementById('receivedBds-no');
    await user.click(no!);
    expect(screen.queryByText(/Select the business development services you received/i)).not.toBeInTheDocument();
  });

  it('shows specify field when Others BDS option is selected', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    await user.click(document.getElementById('receivedBds-yes')!);
    expect(
      screen.queryByLabelText(/Please specify the other business development service/i)
    ).not.toBeInTheDocument();

    await user.click(screen.getByLabelText(/^Others \(specify\)$/i));
    expect(
      screen.getByLabelText(/Please specify the other business development service/i)
    ).toBeInTheDocument();
  });

  it('allows submit with blank respondent name', async () => {
    const user = userEvent.setup();
    render(<BypForm />);

    await user.click(screen.getByRole('button', { name: /Submit BYP Survey/i }));
    expect(screen.queryByText(/Name of respondent is required/i)).not.toBeInTheDocument();
  });

  it('does not render an exact age field', () => {
    render(<BypForm />);
    expect(screen.queryByLabelText(/exact age/i)).not.toBeInTheDocument();
  });

  it('builds payload without exactAge for backend DTO alignment', () => {
    const payload = buildBypSubmissionPayload(
      {
        respondent: {
          ...EMPTY_RESPONDENT_FIELDS,
          respondentPhone: '0772111222',
          respondentGender: 'FEMALE',
          respondentAgeGroup: 'AGE_18_24',
          districtId: 'district-1',
          subcountyId: 'subcounty-1',
          parishId: 'parish-1',
          villageId: 'village-1',
        },
        byp: {
          ...EMPTY_BYP_FIELDS,
          fundReceiptDuration: 'ONE_WEEK',
          receivedActualAmountRequested: true,
          cashAmountReceived: 500000,
          fundsReceiptWaitAfterApplied: 'It took about three weeks after I applied.',
          moneyUsedFor: 'I used the money to buy farming inputs and livestock feed.',
          serviceRating: 'VERY_GOOD',
          loanRepaid: false,
          performanceRating: 'GOOD',
          groupOrganizedTransparently: true,
          receivedBds: true,
          bdsServices: ['TRAINING'],
          improvementSuggestion: 'Provide more technical support.',
        },
      },
      {
        deviceSubmissionId: 'id-1',
        formCompletedAt: '2026-07-28T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload).not.toHaveProperty('exactAge');
    expect(payload).not.toHaveProperty('instalmentPeriod');
    expect(payload.formType).toBe('BYP');
  });

  it('calls enqueue with a fresh deviceSubmissionId on valid submit', async () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .mockReturnValueOnce('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    render(<BypForm onSubmitted={onSubmitted} />);

    await user.type(screen.getByLabelText(/phone number/i), '0772111222');
    await chooseFormOptionByValue(user, /^gender/i, 'FEMALE');
    await chooseFormOptionByValue(user, /age group/i, 'AGE_18_24');

    await waitFor(() => expect(document.getElementById('district')).not.toBeDisabled());
    await chooseFormOptionById(user, 'district', 'district-1');
    await waitFor(() => expect(document.getElementById('subcounty')).not.toBeDisabled());
    await chooseFormOptionById(user, 'subcounty', 'subcounty-1');
    await waitFor(() => expect(document.getElementById('parish')).not.toBeDisabled());
    await chooseFormOptionById(user, 'parish', 'parish-1');
    await waitFor(() => expect(document.getElementById('village')).not.toBeDisabled());
    await chooseFormOptionById(user, 'village', 'village-1');

    await chooseFormOptionByValue(
      user,
      /Q1\. How long did it take you to receive your funds/i,
      'ONE_WEEK'
    );
    await user.click(document.getElementById('receivedActualAmountRequested-yes')!);
    await user.type(screen.getByLabelText(/Q3\. How much cash did you get/i), '500000');
    await user.type(
      screen.getByLabelText(/Q4\. How long did it take you to receive the PDM funds after you applied/i),
      'It took about three weeks after I applied.'
    );
    await user.type(
      screen.getByLabelText(/What did you use the money for/i),
      'I used the money to buy farming inputs and livestock feed.'
    );
    await chooseFormOptionByValue(
      user,
      /Parish Development Committee \(PDC\)/i,
      'VERY_GOOD'
    );
    await user.click(document.getElementById('loanRepaid-no')!);
    await chooseFormOptionByValue(
      user,
      /Q6\. What do you think about the performance of PDM in this parish/i,
      'GOOD'
    );
    await user.click(document.getElementById('groupOrganizedTransparently-yes')!);
    await user.click(document.getElementById('receivedBds-yes')!);
    await user.click(screen.getByLabelText(/Training to improve productivity/i));
    await user.type(
      screen.getByLabelText(/Q9\. What do you think should be improved to make the PDM programme/i),
      'Provide more technical support.'
    );

    await user.click(screen.getByRole('button', { name: /Submit BYP Survey/i }));

    expect(enqueueMock).toHaveBeenCalledTimes(1);
    expect(enqueueMock.mock.calls[0][0].deviceSubmissionId).toBe('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    expect(enqueueMock.mock.calls[0][0].payload.formType).toBe('BYP');
    expect(enqueueMock.mock.calls[0][0].payload).not.toHaveProperty('exactAge');
  }, 15_000);

  it('blocks submit when a local duplicate respondent exists (TC-UNIQ-01-01)', async () => {
    enqueueMock.mockRejectedValueOnce(
      new DuplicateRespondentError(
        'BYP form already submitted for this respondent in Jan–Jun 2026.'
      )
    );

    vi.spyOn(crypto, 'randomUUID').mockReturnValue('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

    const user = userEvent.setup();
    render(<BypForm />);

    await user.type(screen.getByLabelText(/phone number/i), '0772111222');
    await chooseFormOptionByValue(user, /^gender/i, 'FEMALE');
    await chooseFormOptionByValue(user, /age group/i, 'AGE_18_24');

    await waitFor(() => expect(document.getElementById('district')).not.toBeDisabled());
    await chooseFormOptionById(user, 'district', 'district-1');
    await waitFor(() => expect(document.getElementById('subcounty')).not.toBeDisabled());
    await chooseFormOptionById(user, 'subcounty', 'subcounty-1');
    await waitFor(() => expect(document.getElementById('parish')).not.toBeDisabled());
    await chooseFormOptionById(user, 'parish', 'parish-1');
    await waitFor(() => expect(document.getElementById('village')).not.toBeDisabled());
    await chooseFormOptionById(user, 'village', 'village-1');

    await chooseFormOptionByValue(
      user,
      /Q1\. How long did it take you to receive your funds/i,
      'ONE_WEEK'
    );
    await user.click(document.getElementById('receivedActualAmountRequested-yes')!);
    await user.type(screen.getByLabelText(/Q3\. How much cash did you get/i), '500000');
    await user.type(
      screen.getByLabelText(/Q4\. How long did it take you to receive the PDM funds after you applied/i),
      'It took about three weeks after I applied.'
    );
    await user.type(
      screen.getByLabelText(/What did you use the money for/i),
      'I used the money to buy farming inputs and livestock feed.'
    );
    await chooseFormOptionByValue(
      user,
      /Parish Development Committee \(PDC\)/i,
      'VERY_GOOD'
    );
    await user.click(document.getElementById('loanRepaid-no')!);
    await chooseFormOptionByValue(
      user,
      /Q6\. What do you think about the performance of PDM in this parish/i,
      'GOOD'
    );
    await user.click(document.getElementById('groupOrganizedTransparently-yes')!);
    await user.click(document.getElementById('receivedBds-yes')!);
    await user.click(screen.getByLabelText(/Training to improve productivity/i));
    await user.type(
      screen.getByLabelText(/Q9\. What do you think should be improved to make the PDM programme/i),
      'Provide more technical support.'
    );

    await user.click(screen.getByRole('button', { name: /Submit BYP Survey/i }));

    expect(enqueueMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('duplicate-respondent-alert')).toHaveTextContent(
      /BYP form already submitted for this respondent in Jan–Jun 2026\./i
    );
  }, 15_000);
});
