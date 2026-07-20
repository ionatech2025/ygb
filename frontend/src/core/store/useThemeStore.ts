import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'ygb-theme';

interface ThemeStore {
  theme: ThemeMode;
  initialize: () => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

function readStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',

  initialize: () => {
    const theme = readStoredTheme();
    applyTheme(theme);
    set({ theme });
  },

  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));
