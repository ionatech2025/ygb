import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Radio, Users } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
  { to: '/admin/collectors', label: 'Collector Tracker', icon: Activity, end: false },
  { to: '/admin/sync-status', label: 'Sync Status', icon: Radio, end: false },
] as const;

function navLinkClassName(isActive: boolean, compact = false) {
  const base = compact
    ? 'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition'
    : 'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition';
  return isActive
    ? `${base} bg-brand/10 text-brand ring-1 ring-brand/20`
    : `${base} text-text-muted hover:bg-surface-muted hover:text-text`;
}

export function AdminNav({ variant = 'sidebar' }: { variant?: 'sidebar' | 'horizontal' }) {
  if (variant === 'horizontal') {
    return (
      <nav
        aria-label="Admin sections"
        data-testid="admin-nav-horizontal"
        className="flex gap-1 overflow-x-auto border-b border-border/80 bg-surface/80 px-4 py-2 md:hidden"
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => navLinkClassName(isActive, true)}>
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Admin sections" data-testid="admin-nav-sidebar" className="space-y-1 p-4">
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Administration</p>
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => navLinkClassName(isActive)}>
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
