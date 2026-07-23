import { Link } from 'react-router-dom';
import {
  ArrowRight,
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
  PUBLIC_RESOURCE_CARD_ACCENTS,
  publicResourcesClasses,
} from '../../../../core/domain/public-dashboard.theme';

const SECTION_ICONS: Record<BudgetPrioritySection, LucideIcon> = {
  health: HeartPulse,
  agriculture: Sprout,
  education: GraduationCap,
  climate: CloudSun,
};

export function BudgetPrioritiesIndexPage() {
  return (
    <div className={publicResourcesClasses.page} data-testid="budget-priorities-index">
      <header className={publicResourcesClasses.hero} data-testid="budget-priorities-hero">
        <span className={publicResourcesClasses.heroAccent} aria-hidden="true" />
        <span className={publicResourcesClasses.heroGlow} aria-hidden="true" />

        <div className={publicResourcesClasses.heroContent}>
          <p className={publicResourcesClasses.heroEyebrow}>Public participation</p>
          <h1 className={`${publicResourcesClasses.heroTitle} flex items-center gap-3`}>
            <ListChecks className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
            Budget Priorities
          </h1>
          <p className={publicResourcesClasses.heroLead}>
            Tell government where to focus the next budget. Choose one of four sector forms — no account required.
            You may submit once per sector each financial year.
          </p>
        </div>
      </header>

      <section aria-label="Budget priority sectors" className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Choose a sector</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {BUDGET_PRIORITY_SECTIONS.map((section, index) => {
            const accent = PUBLIC_RESOURCE_CARD_ACCENTS[index % PUBLIC_RESOURCE_CARD_ACCENTS.length];
            const Icon = SECTION_ICONS[section.id];

            return (
              <Link
                key={section.id}
                to={BUDGET_PRIORITY_ROUTES.section(section.id)}
                data-testid={`budget-priority-sector-${section.id}`}
                className={`${publicResourcesClasses.resourceCard} min-h-[12rem]`}
              >
                <span className={`${publicResourcesClasses.resourceCardGlow} ${accent.glow}`} aria-hidden="true" />
                <div className={`${publicResourcesClasses.resourceCardIcon} ring-1 ${accent.icon}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className={publicResourcesClasses.resourceCardTitle}>{section.label}</h2>
                <p className={publicResourcesClasses.resourceCardSummary}>{section.description}</p>
                <span className={publicResourcesClasses.resourceCardCta}>
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
