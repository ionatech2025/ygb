import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../../../core/store/useThemeStore';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-surface text-text transition hover:bg-surface-muted"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-nac-orange" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-nac-blue" aria-hidden="true" />
      )}
    </button>
  );
}
