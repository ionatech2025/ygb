import { Outlet, useNavigate } from 'react-router-dom';
import { ClipboardList, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { ThemeToggle } from '../components/ThemeToggle';

export function CollectorLayout() {
  const user = useAuthStore((state) => state.user);
  const isOnline = useAuthStore((state) => state.isOnline);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-surface-muted flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text">Collector Portal</p>
              <p className="truncate text-[11px] text-text-muted">{user?.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span
              className={`inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-[10px] font-bold uppercase tracking-wide ${
                isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {isOnline ? (
                <Wifi className="h-3 w-3" aria-hidden="true" />
              ) : (
                <WifiOff className="h-3 w-3" aria-hidden="true" />
              )}
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-5">
        <div className="mx-auto max-w-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
