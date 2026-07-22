import { describe, expect, it, vi } from 'vitest';
import type { IRespondentUniquenessPort } from '../ports/respondent-uniqueness.port';
import {
  buildDuplicateRespondentMessage,
  validateRespondentUniqueness,
} from './respondent-uniqueness.validation';

function createPort(exists: boolean): IRespondentUniquenessPort {
  return {
    existsLocalDuplicate: vi.fn().mockResolvedValue(exists),
    findLocalDuplicate: vi.fn().mockResolvedValue(null),
  };
}

describe('respondent-uniqueness.validation', () => {
  it('returns invalid with form type and period label when duplicate exists (TC-UNIQ-01-04)', async () => {
    const port = createPort(true);

    const result = await validateRespondentUniqueness(
      {
        formType: 'BYP',
        respondentPhone: '0772111222',
        completedAt: '2026-03-15T10:00:00.000Z',
      },
      port
    );

    expect(result).toEqual({
      valid: false,
      message: 'BYP form already submitted for this respondent in Jan–Jun 2026.',
    });
    expect(port.existsLocalDuplicate).toHaveBeenCalledWith(
      'BYP',
      '0772111222',
      'JAN_JUN_2026'
    );
  });

  it('allows the same phone for a different form type (TC-UNIQ-01-02)', async () => {
    const port = createPort(false);

    const result = await validateRespondentUniqueness(
      {
        formType: 'IYP',
        respondentPhone: '0772111222',
        completedAt: '2026-03-15T10:00:00.000Z',
      },
      port
    );

    expect(result).toEqual({ valid: true });
  });

  it('allows the same phone and form type in a different FY period (TC-UNIQ-01-03)', async () => {
    const port = createPort(false);

    const result = await validateRespondentUniqueness(
      {
        formType: 'BYP',
        respondentPhone: '0772111222',
        completedAt: '2026-08-01T09:00:00.000Z',
      },
      port
    );

    expect(result).toEqual({ valid: true });
    expect(port.existsLocalDuplicate).toHaveBeenCalledWith(
      'BYP',
      '0772111222',
      'JUL_DEC_2026'
    );
  });

  it('builds duplicate message with canonical form type label', () => {
    expect(buildDuplicateRespondentMessage('LGO', 'JUL_DEC_2026')).toBe(
      'LGO form already submitted for this respondent in Jul–Dec 2026.'
    );
  });
});
