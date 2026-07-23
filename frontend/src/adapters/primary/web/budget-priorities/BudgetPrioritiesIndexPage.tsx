import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CloudSun,
  GraduationCap,
  HeartPulse,
  ListChecks,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import {
  BUDGET_PRIORITY_SECTIONS,
  type BudgetPrioritySection,
} from '../../../../core/domain/budget-priority-section.model';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import {
  BUDGET_PRIORITY_DASHBOARD_PROMO_ACCENT,
  budgetPrioritiesClasses,
  getBudgetPrioritySectionAccent,
} from '../../../../core/domain/budget-priorities.theme';

const SECTION_ICONS: Record<BudgetPrioritySection, LucideIcon> = {
  health: HeartPulse,
  agriculture: Sprout,
  education: GraduationCap,
  climate: CloudSun,
};

export function BudgetPrioritiesIndexPage() {
  return (
    <div className={budgetPrioritiesClasses.page} data-testid="budget-priorities-index">
      <header className={budgetPrioritiesClasses.hero} data-testid="budget-priorities-hero">
        <span className={budgetPrioritiesClasses.heroAccent} aria-hidden="true" />
        <span className={budgetPrioritiesClasses.heroGlow} aria-hidden="true" />

        <div className={budgetPrioritiesClasses.heroContent}>
          <p className={budgetPrioritiesClasses.heroEyebrow}>Public participation</p>
          <h1 className={`${budgetPrioritiesClasses.heroTitle} flex items-center gap-3`}>
            <ListChecks className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
            Budget Priorities
          </h1>
          <p className={budgetPrioritiesClasses.heroLead}>
            Tell government where to focus the next budget. Choose one of four sector forms — no account required.
            You may submit once per sector each financial year.
          </p>
        </div>
      </header>

      <section aria-label="Budget priorities dashboard" className="space-y-3">
        <Link
          to={BUDGET_PRIORITY_ROUTES.dashboard}
          data-testid="budget-priorities-dashboard-link"
          className={budgetPrioritiesClasses.dashboardPromoCard}
        >
          <div
            className={`${budgetPrioritiesClasses.sectorCardIcon} ring-1 ${BUDGET_PRIORITY_DASHBOARD_PROMO_ACCENT.icon}`}
          >
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={budgetPrioritiesClasses.sectorCardTitle}>View aggregated dashboard</h2>
            <p className={budgetPrioritiesClasses.sectorCardSummary}>
              Explore anonymised priority trends by sector, location, and theme — no personal data shown.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-nac-blue dark:text-blue-300" aria-hidden="true" />
        </Link>
      </section>

      <section aria-label="Budget priority sectors" className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Choose a sector</h2>
        <div className={budgetPrioritiesClasses.sectorGrid}>
          {BUDGET_PRIORITY_SECTIONS.map((section) => {
            const accent = getBudgetPrioritySectionAccent(section.id);
            const Icon = SECTION_ICONS[section.id];

            return (
              <Link
                key={section.id}
                to={BUDGET_PRIORITY_ROUTES.section(section.id)}
                data-testid={`budget-priority-sector-${section.id}`}
                className={`${budgetPrioritiesClasses.sectorCard} min-h-[12rem]`}
              >
                <span className={`${budgetPrioritiesClasses.sectorCardGlow} ${accent.glow}`} aria-hidden="true" />
                <div className={`${budgetPrioritiesClasses.sectorCardIcon} ring-1 ${accent.icon}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className={budgetPrioritiesClasses.sectorCardTitle}>{section.label}</h2>
                <p className={budgetPrioritiesClasses.sectorCardSummary}>{section.description}</p>
                <span className={budgetPrioritiesClasses.sectorCardCta}>
                  Start form
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
