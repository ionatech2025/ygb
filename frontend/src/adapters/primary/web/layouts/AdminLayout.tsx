import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { ThemeToggle } from '../components/ThemeToggle';

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-surface-muted flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-nac-orange">NAC Admin</p>
            <h1 className="truncate text-base font-bold text-text sm:text-lg">Survey Tool Dashboard</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand sm:inline-flex">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              {user?.fullName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
