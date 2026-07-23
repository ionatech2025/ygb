import {
  AlertTriangle,
  CalendarRange,
  ClipboardList,
  Copy,
  Hash,
  MapPin,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';
import { ADMIN_STAT_CARD_ACCENTS, adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';

const STAT_CARD_ICONS: Record<string, LucideIcon> = {
  'total-submissions': Hash,
  'by-form-type': ClipboardList,
  'top-districts': MapPin,
  'gender-split': Users,
  'by-financial-year': CalendarRange,
  'receipt-synced': Hash,
  'receipt-flagged': AlertTriangle,
  'receipt-duplicate': Copy,
};

export interface StatCardProps {
  card: StatCardViewModel;
  accentIndex?: number;
}

export function StatCard({ card, accentIndex = 0 }: StatCardProps) {
  const accent = ADMIN_STAT_CARD_ACCENTS[accentIndex % ADMIN_STAT_CARD_ACCENTS.length];
  const Icon = STAT_CARD_ICONS[card.id] ?? Hash;

  return (
    <article
      data-testid={`stat-card-${card.id}`}
      className={`${adminDashboardClasses.statCard} ${accent.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className={adminDashboardClasses.statCardTitle}>{card.title}</h4>
          {card.primaryValue !== undefined ? (
            <p className={adminDashboardClasses.statCardValue}>{card.primaryValue}</p>
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
        </div>
        <div className={`${adminDashboardClasses.statCardIcon} ${accent.icon}`} aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
