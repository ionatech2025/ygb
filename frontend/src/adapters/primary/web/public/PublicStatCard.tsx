import { CalendarRange, ClipboardList, Hash, Users, type LucideIcon } from 'lucide-react';
import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';
import {
  PUBLIC_STAT_CARD_ACCENTS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';

const STAT_CARD_ICONS: Record<string, LucideIcon> = {
  'total-submissions': Hash,
  'by-form-type': ClipboardList,
  'gender-split': Users,
  'by-financial-year': CalendarRange,
};

export interface PublicStatCardProps {
  card: StatCardViewModel;
  accentIndex?: number;
  className?: string;
}

export function PublicStatCard({ card, accentIndex = 0, className = '' }: PublicStatCardProps) {
  const accent = PUBLIC_STAT_CARD_ACCENTS[accentIndex % PUBLIC_STAT_CARD_ACCENTS.length];
  const Icon = STAT_CARD_ICONS[card.id] ?? Hash;

  return (
    <article
      data-testid={`stat-card-${card.id}`}
      className={`${publicDashboardClasses.statCard} ${accent.ring} ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className={`${publicDashboardClasses.statCardTitle} min-w-0 flex-1`}>{card.title}</h4>
        <div className={`${publicDashboardClasses.statCardIcon} ${accent.icon}`} aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {card.primaryValue !== undefined ? (
        <p className={publicDashboardClasses.statCardValue}>{card.primaryValue}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {(card.items ?? []).length === 0 ? (
            <li className="text-sm text-text-muted">No data</li>
          ) : (
            card.items?.map((item) => (
              <li
                key={item.label}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug text-text-muted">
                  {item.label}
                </span>
                <span className="shrink-0 pt-0.5 font-semibold tabular-nums text-text">{item.value}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </article>
  );
}
