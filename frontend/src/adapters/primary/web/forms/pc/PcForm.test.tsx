import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PDC_EFFECTIVENESS_OPTIONS } from '../../../../../core/domain/pc-form.model';
import { PcForm } from './PcForm';

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
  useAuthStore: (selector: (state: { user: { id: string }; isOnline: boolean }) => unknown) =>
    selector({ user: { id: '22222222-2222-2222-2222-222222222222' }, isOnline: true }),
}));

async function fillRespondent(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name of respondent/i), 'Parish Chief Name');
  await user.type(screen.getByLabelText(/phone number/i), '0772111555');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'MALE');
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

async function fillFundsReceipt(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Q1\. Amount of PDM fund expected/i), '1500000');
  await user.type(screen.getByLabelText(/Q2\. Actual amount PDM fund received/i), '1500000');
}

async function fillAccessSection(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Q3\. Total number of beneficiaries/i), '100');
  await user.type(screen.getByLabelText(/Q4\. Total number of beneficiaries under 30/i), '40');
  await user.type(screen.getByLabelText(/Q5\. Total number of young women under 30/i), '22');
  await user.type(screen.getByLabelText(/Q6\. Total number of young men under 30/i), '18');
  await user.type(
    screen.getByLabelText(/Q7\. What obstacles constrain the ability of the beneficiaries/i),
    'Lack of transport equipment is the main obstacle.'
  );
  await user.click(document.getElementById('spendingTargetedToMostInNeed-yes')!);
}

async function fillMinimalValidForm(user: ReturnType<typeof userEvent.setup>) {
  await fillRespondent(user);
  await fillFundsReceipt(user);
  await fillAccessSection(user);

  await user.type(screen.getByLabelText(/Q9\. Total number of committee members/i), '7');
  await user.type(screen.getByLabelText(/Q10\. Number of youth representatives/i), '3');
  await user.type(
    screen.getByLabelText(/Q11\. Total number of young women aged 30 years below coopted as committee members/i),
    '4'
  );
  await user.click(document.getElementById('pdcTrainingReceived-no')!);
  await user.selectOptions(
    screen.getByLabelText(/Q14\. How effective are the PDC members in fulfilling their responsibilities/i),
    'VERY_EFFECTIVE'
  );

  await user.click(screen.getByLabelText(/^CAO$/i));
  await user.type(
    screen.getByLabelText(/Q17\. How was the monitoring carried out/i),
    'Regular field checks performed by the parish team.'
  );
  await user.click(document.getElementById('reportSharedWithRespondent-yes')!);
  await user.click(document.getElementById('improvementsSeen-no')!);

  await user.click(document.getElementById('progressReportsSubmitted-no')!);
  await user.type(
    screen.getByLabelText(/Q23\. The number of young people who benefited from the PDM and started agricultural enterprises/i),
    '10'
  );
  await user.type(
    screen.getByLabelText(
      /Q26\. The number of youth-led enterprises established with support from the PDM and remained active after the support/i
    ),
    '8'
  );
  await user.type(
    screen.getByLabelText(/What do you think should be improved to make the PDM programme more efficient and effective/i),
    'Provide more monitoring tools for parish chiefs.'
  );
}

describe('PcForm', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('questions display Q numbers 1–26 plus improvement question', () => {
    render(<PcForm />);

    for (let questionNumber = 1; questionNumber <= 26; questionNumber += 1) {
      expect(screen.getByText(new RegExp(`Q${questionNumber}\\.`))).toBeInTheDocument();
    }

    expect(
      screen.getByLabelText(
        /What do you think should be improved to make the PDM programme more efficient and effective in your community/i
      )
    ).toBeInTheDocument();
  });

  it('Section D title is PDM Programme Monitoring and Oversight', () => {
    render(<PcForm />);
    expect(screen.getByRole('heading', { name: 'PDM Programme Monitoring and Oversight' })).toBeInTheDocument();
  });

  it('effectiveness dropdown shows five new labels only', () => {
    render(<PcForm />);

    const select = screen.getByLabelText(/Q14\. How effective are the PDC members/i);
    const optionLabels = Array.from(select.querySelectorAll('option'))
      .map((option) => option.textContent?.trim())
      .filter((label) => label && label !== 'Select rating…');

    expect(optionLabels).toEqual(PDC_EFFECTIVENESS_OPTIONS.map((option) => option.label));
  });

  it('young men beneficiaries field visible in Section B', () => {
    render(<PcForm />);
    expect(screen.getByLabelText(/Q6\. Total number of young men under 30/i)).toBeInTheDocument();
  });

  it('monitoring question shows (select all that apply)', () => {
    render(<PcForm />);
    expect(screen.getByText(/Q16\. If yes, who monitored the programme\? \(select all that apply\)/i)).toBeInTheDocument();
  });

  it('self-reliance questions use full-sentence labels from client doc', () => {
    render(<PcForm />);

    expect(
      screen.getByLabelText(/Q23\. The number of young people who benefited from the PDM and started agricultural enterprises/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Q26\. The number of youth-led enterprises established with support from the PDM and remained active after the support/i
      )
    ).toBeInTheDocument();
  });

  it('PDC training = Yes requires at least one training area (TC-FORM-05-02)', async () => {
    const user = userEvent.setup();
    render(<PcForm />);

    await fillRespondent(user);
    await fillFundsReceipt(user);
    await fillAccessSection(user);
    await user.click(document.getElementById('pdcTrainingReceived-yes')!);

    expect(screen.getByText(/Q13\. If yes, what specific areas did they receive training in/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Submit PC Survey/i }));
    expect(enqueueMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Select at least one training area/i)).toBeInTheDocument();
  }, 20_000);

  it('Others (specify) in monitored-by shows required text field (TC-FORM-05-03)', async () => {
    const user = userEvent.setup();
    render(<PcForm />);

    await user.click(screen.getByLabelText(/Others \(specify\)/i));
    expect(screen.getByLabelText(/Specify who monitored the programme/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Submit PC Survey/i }));
    expect(enqueueMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Please specify who monitored the programme/i)).toBeInTheDocument();
  });

  it('full valid submission calls enqueue with complete payload (TC-FORM-05-04)', async () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .mockReturnValueOnce('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    const user = userEvent.setup();
    render(<PcForm />);

    await fillMinimalValidForm(user);

    await user.click(screen.getByRole('button', { name: /Submit PC Survey/i }));

    await waitFor(() => expect(enqueueMock).toHaveBeenCalledTimes(1), { timeout: 15_000 });

    const payload = enqueueMock.mock.calls[0][0].payload;
    expect(payload.formType).toBe('PC');
    expect(payload.amountExpected).toBe(1500000);
    expect(payload.youngMenBeneficiaries).toBe(18);
    expect(payload.monitoredBy).toEqual(['CAO']);
    expect(payload.pdcTrainingAreas).toBeNull();
    expect(payload.pdcEffectivenessRating).toBe('VERY_EFFECTIVE');
    expect(payload.programmeImprovementSuggestion).toBe('Provide more monitoring tools for parish chiefs.');
  }, 30_000);
});
