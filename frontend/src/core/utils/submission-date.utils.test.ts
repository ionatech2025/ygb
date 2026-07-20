import { describe, expect, it } from 'vitest';
import { countCreatedToday, isSameLocalDay, localDayKey } from './submission-date.utils';

describe('submission-date.utils', () => {
  it('resets count when mocked date advances to next day (TC-FORM-13-03)', () => {
    const dayOne = new Date('2026-07-20T15:00:00');
    const dayTwo = new Date('2026-07-21T08:00:00');

    expect(isSameLocalDay(dayOne, dayTwo)).toBe(false);
    expect(localDayKey(dayOne)).toBe('2026-07-20');
    expect(localDayKey(dayTwo)).toBe('2026-07-21');

    const timestamps = [
      '2026-07-20T10:00:00',
      '2026-07-20T18:30:00',
      '2026-07-19T20:00:00',
    ];

    expect(countCreatedToday(timestamps, dayOne)).toBe(2);
    expect(countCreatedToday(timestamps, dayTwo)).toBe(0);
  });
});
