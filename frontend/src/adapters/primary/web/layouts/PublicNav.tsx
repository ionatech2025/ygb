import { NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/resources', label: 'Resources', icon: BookOpen, end: true },
] as const;

function navLinkClassName(isActive: boolean) {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition min-h-11 min-w-[5.5rem] justify-center sm:justify-start';
  return isActive
    ? `${base} bg-brand-light text-brand shadow-sm ring-1 ring-brand/20`
    : `${base} text-text-muted hover:bg-surface-muted hover:text-text`;
}

export function PublicNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Public sections" data-testid="public-nav" className="flex flex-col gap-1 sm:flex-row">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) => navLinkClassName(isActive)}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
