import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { usePublicDashboardFilterUrlSync } from '../../../../core/hooks/usePublicDashboardFilterUrlSync';
import { ThemeToggle } from '../components/ThemeToggle';
import { PublicNav } from './PublicNav';

export function PublicLayout() {
  usePublicDashboardFilterUrlSync();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="public-layout-bg flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 shadow-sm backdrop-blur-md">
        <div className="h-1 bg-gradient-to-r from-nac-blue via-brand to-nac-orange" aria-hidden="true" />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:max-w-7xl">
          <Link to="/dashboard" className="min-w-0" onClick={closeMobileMenu}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-nac-orange">YGB Public</p>
            <h1 className="truncate text-base font-bold text-nac-blue sm:text-lg dark:text-text">
              Parish Development Model
            </h1>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <PublicNav />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="public-mobile-nav"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-surface text-text transition hover:bg-surface-muted"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div
            id="public-mobile-nav"
            data-testid="public-mobile-nav"
            className="border-t border-border bg-surface px-4 py-3 md:hidden"
          >
            <PublicNav onNavigate={closeMobileMenu} />
          </div>
        ) : null}
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl text-center xl:max-w-7xl">
          <p className="text-sm font-medium text-text">YGB Survey Tool — National Association of Councillors (NAC)</p>
          <p className="mt-2 text-xs leading-relaxed text-text-muted">
            Anonymised public data for transparency and programme accountability.
          </p>
        </div>
      </footer>
    </div>
  );
}
