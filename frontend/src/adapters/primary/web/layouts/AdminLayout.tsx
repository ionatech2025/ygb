import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useDashboardFilterUrlSync } from '../../../../core/hooks/useDashboardFilterUrlSync';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { ThemeToggle } from '../components/ThemeToggle';
import { AdminNav } from './AdminNav';

export function AdminLayout() {
  useDashboardFilterUrlSync();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-layout-bg flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-nac-orange">YGB Admin</p>
            <h1 className="truncate text-base font-semibold tracking-tight text-text sm:text-lg">
              Survey Tool Dashboard
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <span className="hidden items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand sm:inline-flex">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              {user?.fullName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-text-muted transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:border-rose-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <AdminNav variant="horizontal" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <aside className="hidden w-60 shrink-0 border-r border-border/80 bg-surface/50 md:block">
          <AdminNav variant="sidebar" />
        </aside>
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
