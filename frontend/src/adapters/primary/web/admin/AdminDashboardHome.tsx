import { BarChart3, LayoutDashboard } from 'lucide-react';

export function AdminDashboardHome() {
  return (
    <div className="mx-auto max-w-6xl space-y-6" data-testid="admin-dashboard-home">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
          <LayoutDashboard className="h-5 w-5 text-brand" aria-hidden="true" />
          Dashboard Overview
        </h2>
        <p className="text-sm text-text-muted">
          Summary statistics and charts will appear here (issues 003–004).
        </p>
      </div>

      <section aria-label="Summary statistics placeholders" data-testid="admin-stat-placeholders">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">Summary stats</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Total submissions', 'Active collectors', 'Districts covered', 'This period'].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-dashed border-border bg-surface p-5 shadow-sm"
            >
              <p className="text-xs font-semibold text-text-muted">{label}</p>
              <p className="mt-2 text-2xl font-bold text-text-muted/40">—</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Chart placeholders" data-testid="admin-chart-placeholders">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-muted">
          <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
          Charts
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-muted">
            Submissions over time
          </div>
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-muted">
            Breakdown by district / form type
          </div>
        </div>
      </section>
    </div>
  );
}
