import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

vi.mock('../../../../secondary/submission/submission-queue.adapter', () => ({
  submissionQueue: { enqueue: (...args: unknown[]) => enqueueMock(...args) },
}));

vi.mock('../../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: { id: string } }) => unknown) =>
    selector({ user: { id: '22222222-2222-2222-2222-222222222222' } }),
}));

async function fillRespondent(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name of respondent/i), 'Parish Chief Name');
  await user.type(screen.getByLabelText(/phone number/i), '0772111555');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'MALE');
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

async function fillFundsReceipt(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Amount expected/i), '1500000');
  await user.type(screen.getByLabelText(/Amount received/i), '1500000');
  await user.type(screen.getByLabelText(/^Total beneficiaries/i), '100');
  await user.type(screen.getByLabelText(/^Young people under 30/i), '40');
  await user.type(screen.getByLabelText(/^Young women under 30/i), '30');
}

async function fillMinimalValidForm(user: ReturnType<typeof userEvent.setup>) {
  await fillRespondent(user);
  await fillFundsReceipt(user);

  await user.type(
    screen.getByLabelText(/Obstacles faced in accessing the fund/i),
    'Lack of transport equipment is the main obstacle.'
  );
  await user.click(document.getElementById('spendingTargetedToMostInNeed-yes')!);

  await user.type(screen.getByLabelText(/^Total PDC members/i), '7');
  await user.type(screen.getByLabelText(/^Youth members/i), '3');
  await user.type(screen.getByLabelText(/^Women members/i), '4');
  await user.click(document.getElementById('pdcTrainingReceived-no')!);
  await user.selectOptions(screen.getByLabelText(/PDC effectiveness rating/i), 'FULLY');

  await user.click(screen.getByLabelText(/^CAO$/i));
  await user.type(
    screen.getByLabelText(/Monitoring method/i),
    'Regular field checks performed by the parish team.'
  );
  await user.click(document.getElementById('reportSharedWithRespondent-yes')!);

  await user.click(document.getElementById('improvementsSeen-no')!);
  await user.click(document.getElementById('progressReportsSubmitted-no')!);
  await user.type(screen.getByLabelText(/Self-reliant beneficiaries count/i), '10');
  await user.type(screen.getByLabelText(/Self-reliance group projects count/i), '8');
}

describe('PcForm', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('five sections render in correct order (TC-FORM-05-01)', () => {
    render(<PcForm />);

    const headings = screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent);
    const sectionTitles = headings.filter((title) =>
      [
        'PDM Funds Receipt',
        'Access to PDM Fund',
        'PDC',
        'Monitoring & Oversight',
        'Self-reliance',
      ].includes(title ?? '')
    );

    expect(sectionTitles).toEqual([
      'PDM Funds Receipt',
      'Access to PDM Fund',
      'PDC',
      'Monitoring & Oversight',
      'Self-reliance',
    ]);
  });

  it('PDC training = Yes requires at least one training area (TC-FORM-05-02)', async () => {
    const user = userEvent.setup();
    render(<PcForm />);

    await fillRespondent(user);
    await fillFundsReceipt(user);
    await user.click(document.getElementById('pdcTrainingReceived-yes')!);

    expect(screen.getByText(/Training areas received/i)).toBeInTheDocument();

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
    expect(payload.monitoredBy).toEqual(['CAO']);
    expect(payload.pdcTrainingAreas).toBeNull();
  }, 30_000);
});
