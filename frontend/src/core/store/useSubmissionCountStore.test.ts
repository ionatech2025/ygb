import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSubmissionCountStore } from './useSubmissionCountStore';

vi.mock('../../adapters/secondary/api/submission-stats.adapter', () => ({
  submissionStats: {
    countTodayLocal: vi.fn().mockResolvedValue(2),
    fetchServerDailyCount: vi.fn().mockResolvedValue(5),
  },
}));

describe('useSubmissionCountStore', () => {
  beforeEach(() => {
    useSubmissionCountStore.setState({
      todayCount: 0,
      dayKey: '2026-07-20',
      initialized: false,
    });
  });

  it('keeps higher local count when reconciling with server', async () => {
    useSubmissionCountStore.setState({ todayCount: 7 });
    await useSubmissionCountStore.getState().reconcileWithServer('token');
    expect(useSubmissionCountStore.getState().todayCount).toBe(7);
  });

  it('raises count when server reports more submissions', async () => {
    useSubmissionCountStore.setState({ todayCount: 2 });
    await useSubmissionCountStore.getState().reconcileWithServer('token');
    expect(useSubmissionCountStore.getState().todayCount).toBe(5);
  });
});
