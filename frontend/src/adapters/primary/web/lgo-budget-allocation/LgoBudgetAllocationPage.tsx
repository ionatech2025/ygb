import { Link } from 'react-router-dom';
import { ArrowLeft, Landmark } from 'lucide-react';
import { LGO_BUDGET_ALLOCATION_ROUTES } from '../../../../core/domain/lgo-budget-allocation.routes';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
import { LgoBudgetAllocationForm } from './LgoBudgetAllocationForm';

export function LgoBudgetAllocationPage() {
  return (
    <div className={lgoBudgetAllocationClasses.page} data-testid="lgo-budget-allocation-page">
      <Link
        to={LGO_BUDGET_ALLOCATION_ROUTES.collectorDashboard}
        className={lgoBudgetAllocationClasses.backLink}
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        Collector dashboard
      </Link>

      <header className={`${lgoBudgetAllocationClasses.hero} mt-4`}>
        <span className={lgoBudgetAllocationClasses.heroAccent} aria-hidden="true" />
        <span className={lgoBudgetAllocationClasses.heroGlow} aria-hidden="true" />

        <div className={lgoBudgetAllocationClasses.heroContent}>
          <p className={lgoBudgetAllocationClasses.heroEyebrow}>Data collector interview</p>
          <h1 className={`${lgoBudgetAllocationClasses.heroTitle} flex items-center gap-3`}>
            <span className={lgoBudgetAllocationClasses.dashboardEntryIcon}>
              <Landmark className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            Budget Allocation Interview
          </h1>
          <p className={lgoBudgetAllocationClasses.heroLead}>
            Record how a Local Government Official allocated the previous financial year&apos;s budget
            across sectors, why those choices were made, and their recommendations for the coming year.
            This is separate from the PDM LGO Questionnaire.
          </p>
        </div>
      </header>

      <section
        className={`${lgoBudgetAllocationClasses.formPanel} relative`}
        data-testid="lgo-budget-allocation-form-slot"
        aria-label="LGO budget allocation form"
      >
        <span className={lgoBudgetAllocationClasses.formPanelAccent} aria-hidden="true" />
        <LgoBudgetAllocationForm />
      </section>
    </div>
  );
}
