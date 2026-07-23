import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';
import {
  PUBLIC_STAT_CARD_ACCENTS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';

export interface PublicStatCardProps {
  card: StatCardViewModel;
  accentIndex?: number;
}

export function PublicStatCard({ card, accentIndex = 0 }: PublicStatCardProps) {
  const accentClass = PUBLIC_STAT_CARD_ACCENTS[accentIndex % PUBLIC_STAT_CARD_ACCENTS.length];

  return (
    <article
      data-testid={`stat-card-${card.id}`}
      className={`${publicDashboardClasses.statCard} ${accentClass}`}
    >
      <h4 className={publicDashboardClasses.statCardTitle}>{card.title}</h4>
      {card.primaryValue !== undefined ? (
        <p className={publicDashboardClasses.statCardValue}>{card.primaryValue}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {(card.items ?? []).length === 0 ? (
            <li className="text-sm text-text-muted">No data</li>
          ) : (
            card.items?.map((item) => (
              <li key={item.label} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-text-muted">{item.label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-text">{item.value}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </article>
  );
}
