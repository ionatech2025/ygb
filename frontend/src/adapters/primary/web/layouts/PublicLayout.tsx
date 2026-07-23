import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { usePublicDashboardFilterUrlSync } from '../../../../core/hooks/usePublicDashboardFilterUrlSync';
import { useBudgetPriorityDashboardFilterUrlSync } from '../../../../core/hooks/useBudgetPriorityDashboardFilterUrlSync';
import { ThemeToggle } from '../components/ThemeToggle';
import { publicLayoutClasses } from '../../../../core/domain/public-dashboard.theme';
import { PublicNav } from './PublicNav';

function StaffSignInLink({ onNavigate, className = '' }: { onNavigate?: () => void; className?: string }) {
  return (
    <Link
      to="/login"
      onClick={onNavigate}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-text-muted transition hover:bg-surface-muted hover:text-text ${className}`}
    >
      <LogIn className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      Staff sign in
    </Link>
  );
}

export function PublicLayout() {
  usePublicDashboardFilterUrlSync();
  useBudgetPriorityDashboardFilterUrlSync();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="public-layout-bg flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 shadow-sm backdrop-blur-lg">
        <div className="h-1 bg-gradient-to-r from-nac-blue via-brand to-nac-orange" aria-hidden="true" />

        <div className={publicLayoutClasses.shell}>
          <Link to="/dashboard" className="min-w-0 group" onClick={closeMobileMenu}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-nac-orange">YGB Public</p>
            <h1 className="truncate text-base font-semibold tracking-tight text-nac-blue transition group-hover:text-brand sm:text-lg dark:text-text">
              Parish Development Model
            </h1>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <PublicNav />
            <StaffSignInLink onNavigate={closeMobileMenu} />
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
            <StaffSignInLink onNavigate={closeMobileMenu} className="mt-3 w-full justify-center" />
          </div>
        ) : null}
      </header>

      <main className={publicLayoutClasses.main}>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface py-8 sm:py-10">
        <div className={publicLayoutClasses.footerShell}>
          <div className={publicLayoutClasses.footerCopy}>
            <p className="text-sm font-medium text-text">Survey Tool — Youth Go Budget App (YGB)</p>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              Anonymised public data for transparency and programme accountability.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
