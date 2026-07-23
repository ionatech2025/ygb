import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ListChecks } from 'lucide-react';
import { getBudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import { publicDashboardClasses, publicResourcesClasses } from '../../../../core/domain/public-dashboard.theme';
import { BudgetPriorityForm } from './BudgetPriorityForm';

export function BudgetPrioritySectionLayout() {
  const { section: sectionParam } = useParams<{ section: string }>();
  const section = getBudgetPrioritySection(sectionParam);

  if (!section) {
    return <Navigate to={BUDGET_PRIORITY_ROUTES.index} replace />;
  }

  return (
    <div className={publicResourcesClasses.page} data-testid="budget-priority-section-shell">
      <Link to={BUDGET_PRIORITY_ROUTES.index} className={publicResourcesClasses.backLink}>
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        All sectors
      </Link>

      <header className={`${publicResourcesClasses.hero} mt-4`}>
        <span className={publicResourcesClasses.heroAccent} aria-hidden="true" />
        <span className={publicResourcesClasses.heroGlow} aria-hidden="true" />

        <div className={publicResourcesClasses.heroContent}>
          <p className={publicResourcesClasses.heroEyebrow}>Budget Priorities</p>
          <h1 className={`${publicResourcesClasses.heroTitle} flex items-center gap-3`}>
            <ListChecks className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
            {section.label}
          </h1>
          <p className={publicResourcesClasses.heroLead}>{section.description}</p>
        </div>
      </header>

      <section
        className={`${publicDashboardClasses.panel} p-6 sm:p-8`}
        data-testid="budget-priority-form-slot"
        aria-label={`${section.shortLabel} submission form`}
      >
        <BudgetPriorityForm section={section.id} />
      </section>
    </div>
  );
}
