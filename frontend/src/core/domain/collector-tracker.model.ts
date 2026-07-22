export interface CollectorLeaderboardEntry {
  collectorId: string;
  fullName: string;
  totalCount: number;
}

export interface CollectorFormTypeBreakdown {
  formType: string;
  count: number;
}

export interface CollectorDistrictBreakdown {
  districtId: string;
  districtName: string;
  count: number;
}

export interface CollectorBreakdown {
  byFormType: CollectorFormTypeBreakdown[];
  byDistrict: CollectorDistrictBreakdown[];
}

export type LeaderboardSortKey = 'totalCount' | 'fullName';
export type LeaderboardSortDirection = 'asc' | 'desc';

export function sortLeaderboardEntries(
  entries: CollectorLeaderboardEntry[],
  sortKey: LeaderboardSortKey = 'totalCount',
  direction: LeaderboardSortDirection = 'desc'
): CollectorLeaderboardEntry[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...entries].sort((a, b) => {
    if (sortKey === 'fullName') {
      return factor * a.fullName.localeCompare(b.fullName);
    }
    const countDiff = a.totalCount - b.totalCount;
    if (countDiff !== 0) {
      return factor * countDiff;
    }
    return a.fullName.localeCompare(b.fullName);
  });
}
