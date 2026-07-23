import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ListChecks } from 'lucide-react';
import { getBudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import {
  budgetPrioritiesClasses,
  getBudgetPrioritySectionAccent,
} from '../../../../core/domain/budget-priorities.theme';
import { BudgetPriorityForm } from './BudgetPriorityForm';

export function BudgetPrioritySectionLayout() {
  const { section: sectionParam } = useParams<{ section: string }>();
  const section = getBudgetPrioritySection(sectionParam);

  if (!section) {
    return <Navigate to={BUDGET_PRIORITY_ROUTES.index} replace />;
  }

  const accent = getBudgetPrioritySectionAccent(section.id);

  return (
    <div className={budgetPrioritiesClasses.page} data-testid="budget-priority-section-shell">
      <Link to={BUDGET_PRIORITY_ROUTES.index} className={budgetPrioritiesClasses.backLink}>
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        All sectors
      </Link>

      <header className={`${budgetPrioritiesClasses.hero} mt-4`}>
        <span className={budgetPrioritiesClasses.heroAccent} aria-hidden="true" />
        <span className={`${budgetPrioritiesClasses.heroGlow} ${accent.glow}`} aria-hidden="true" />

        <div className={budgetPrioritiesClasses.heroContent}>
          <p className={budgetPrioritiesClasses.heroEyebrow}>Budget Priorities</p>
          <h1 className={`${budgetPrioritiesClasses.heroTitle} flex items-center gap-3`}>
            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-11 sm:w-11 ${accent.icon}`}
            >
              <ListChecks className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            {section.label}
          </h1>
          <p className={budgetPrioritiesClasses.heroLead}>{section.description}</p>
        </div>
      </header>

      <section
        className={`${budgetPrioritiesClasses.formPanel} relative`}
        data-testid="budget-priority-form-slot"
        aria-label={`${section.shortLabel} submission form`}
      >
        <span
          className={`${budgetPrioritiesClasses.formPanelAccent} ${accent.stripe}`}
          aria-hidden="true"
        />
        <BudgetPriorityForm section={section.id} />
      </section>
    </div>
  );
}
