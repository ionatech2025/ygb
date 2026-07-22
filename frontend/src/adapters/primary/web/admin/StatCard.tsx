import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';

export interface StatCardProps {
  card: StatCardViewModel;
}

export function StatCard({ card }: StatCardProps) {
  return (
    <article
      data-testid={`stat-card-${card.id}`}
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <h4 className="text-xs font-semibold text-text-muted">{card.title}</h4>
      {card.primaryValue !== undefined ? (
        <p className="mt-2 text-2xl font-bold text-text">{card.primaryValue}</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {(card.items ?? []).length === 0 ? (
            <li className="text-sm text-text-muted">No data</li>
          ) : (
            card.items?.map((item) => (
              <li key={item.label} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-text-muted">{item.label}</span>
                <span className="shrink-0 font-semibold text-text">{item.value}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </article>
  );
}
