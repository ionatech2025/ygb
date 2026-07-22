import { describe, expect, it } from 'vitest';
import { sortLeaderboardEntries } from './collector-tracker.model';

describe('sortLeaderboardEntries', () => {
  it('sorts by totalCount descending by default', () => {
    const sorted = sortLeaderboardEntries([
      { collectorId: 'c2', fullName: 'Beta', totalCount: 2 },
      { collectorId: 'c1', fullName: 'Alpha', totalCount: 5 },
      { collectorId: 'c3', fullName: 'Gamma', totalCount: 5 },
    ]);

    expect(sorted.map((entry) => entry.collectorId)).toEqual(['c1', 'c3', 'c2']);
  });
});
