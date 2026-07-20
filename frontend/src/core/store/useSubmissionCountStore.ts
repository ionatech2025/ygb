import { create } from 'zustand';
import { submissionStats } from '../../adapters/secondary/api/submission-stats.adapter';
import { localDayKey } from '../utils/submission-date.utils';

interface SubmissionCountState {
  todayCount: number;
  dayKey: string;
  initialized: boolean;
  initialize: () => Promise<void>;
  recordSubmission: () => void;
  refreshFromLocal: () => Promise<void>;
  reconcileWithServer: (accessToken: string) => Promise<void>;
  ensureCurrentDay: () => void;
}

export const useSubmissionCountStore = create<SubmissionCountState>((set, get) => ({
  todayCount: 0,
  dayKey: localDayKey(),
  initialized: false,

  ensureCurrentDay: () => {
    const currentDay = localDayKey();
    if (get().dayKey !== currentDay) {
      set({ dayKey: currentDay, todayCount: 0 });
    }
  },

  recordSubmission: () => {
    get().ensureCurrentDay();
    set((state) => ({ todayCount: state.todayCount + 1 }));
  },

  refreshFromLocal: async () => {
    get().ensureCurrentDay();
    const localCount = await submissionStats.countTodayLocal();
    set((state) => ({
      todayCount: Math.max(state.todayCount, localCount),
      initialized: true,
    }));
  },

  initialize: async () => {
    get().ensureCurrentDay();
    await get().refreshFromLocal();
  },

  reconcileWithServer: async (accessToken: string) => {
    try {
      const serverCount = await submissionStats.fetchServerDailyCount(accessToken);
      set((state) => ({
        todayCount: Math.max(state.todayCount, serverCount),
      }));
    } catch {
      // Keep optimistic/local count when server is unavailable.
    }
  },
}));
