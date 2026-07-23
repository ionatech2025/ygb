import { describe, expect, it } from 'vitest';
import { ApiError } from './api/api-client';
import {
  buildDuplicateBudgetPriorityMessage,
  mapBudgetPrioritySubmitError,
} from './budget-priority-errors';

describe('budget-priority-errors', () => {
  it('maps 409 to duplicate copy naming the section and FY period (TC-BP-01-02)', () => {
    const mapped = mapBudgetPrioritySubmitError(new ApiError('Conflict', 409), 'health', {
      financialYearPeriodKey: 'JAN_JUN_2026',
    });

    expect(mapped.kind).toBe('duplicate');
    expect(mapped.message).toContain('Health');
    expect(mapped.message).toContain('Jan–Jun 2026');
    expect(mapped.message).toMatch(/one submission per sector/i);
  });

  it('maps 400 to validation copy', () => {
    const mapped = mapBudgetPrioritySubmitError(
      new ApiError('Invalid Uganda phone number: 12345', 400),
      'agriculture'
    );

    expect(mapped.kind).toBe('validation');
    expect(mapped.message).toContain('Invalid Uganda phone number');
  });

  it('builds duplicate message with fallback period label', () => {
    expect(buildDuplicateBudgetPriorityMessage('climate')).toMatch(/this financial year period/i);
  });
});
