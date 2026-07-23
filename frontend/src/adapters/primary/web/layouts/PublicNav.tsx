import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, ClipboardList, Landmark, LayoutDashboard } from 'lucide-react';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import { LGO_BUDGET_ALLOCATION_ROUTES } from '../../../../core/domain/lgo-budget-allocation.routes';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: BUDGET_PRIORITY_ROUTES.index, label: 'Budget Priorities', icon: ClipboardList, end: false },
  { to: LGO_BUDGET_ALLOCATION_ROUTES.dashboard, label: 'LGO Budget', icon: Landmark, end: true },
  { to: '/resources', label: 'Resources', icon: BookOpen, end: true },
] as const;

function navLinkClassName(isActive: boolean) {
  const base =
    'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition min-h-11 min-w-[5.5rem] justify-center sm:justify-start';
  return isActive
    ? `${base} bg-surface text-text shadow-sm ring-1 ring-border/80`
    : `${base} text-text-muted hover:text-text`;
}

function isBudgetPrioritiesNavActive(pathname: string) {
  return pathname.startsWith(BUDGET_PRIORITY_ROUTES.index) || pathname.startsWith(BUDGET_PRIORITY_ROUTES.dashboard);
}

function isLgoBudgetAllocationNavActive(pathname: string) {
  return pathname.startsWith(LGO_BUDGET_ALLOCATION_ROUTES.dashboard);
}

export function PublicNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav
      aria-label="Public sections"
      data-testid="public-nav"
      className="inline-flex flex-col gap-1 rounded-xl border border-border/80 bg-surface-muted/60 p-1 sm:flex-row"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) => {
            const active =
              isActive ||
              (to === BUDGET_PRIORITY_ROUTES.index && isBudgetPrioritiesNavActive(location.pathname)) ||
              (to === LGO_BUDGET_ALLOCATION_ROUTES.dashboard && isLgoBudgetAllocationNavActive(location.pathname));
            return navLinkClassName(active);
          }}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
