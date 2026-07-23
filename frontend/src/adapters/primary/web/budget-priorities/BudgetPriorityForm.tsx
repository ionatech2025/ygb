import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import {
  buildBudgetPrioritySubmissionPayload,
  EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS,
  type BudgetPrioritySubmissionResult,
} from '../../../../core/domain/budget-priority-submission.model';
import {
  hasBudgetPriorityFormErrors,
  validateBudgetPriorityForm,
  type BudgetPriorityFormErrors,
} from '../../../../core/domain/budget-priority-validation';
import {
  mapBudgetPrioritySubmitError,
  type MappedBudgetPriorityError,
} from '../../../../core/budget-priority-errors';
import { deriveFinancialYearPeriod, toFinancialYearPeriodKey } from '../../../../core/financial-year-period';
import type { IBudgetPriorityApiPort } from '../../../../ports/budget-priority-api.port';
import { HttpBudgetPriorityAdapter } from '../../../secondary/api/budget-priority-api.adapter';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { BudgetPriorityDemographicsSection } from './BudgetPriorityDemographicsSection';
import { BudgetPriorityAreasSection } from './BudgetPriorityAreasSection';
import { budgetPrioritiesClasses } from '../../../../core/domain/budget-priorities.theme';
import { BudgetPriorityDuplicateBlock } from './BudgetPriorityDuplicateBlock';
import { BudgetPriorityErrorAlert } from './BudgetPriorityErrorAlert';

export interface BudgetPriorityFormProps {
  section: BudgetPrioritySection;
  api?: IBudgetPriorityApiPort;
  locationRepository?: ILocationRepositoryPort;
  onSubmitted?: (result: BudgetPrioritySubmissionResult) => void;
}

export function BudgetPriorityForm({
  section,
  api = new HttpBudgetPriorityAdapter(),
  locationRepository,
  onSubmitted,
}: BudgetPriorityFormProps) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [demographics, setDemographics] = useState(EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS);
  const [rankedAreas, setRankedAreas] = useState<string[]>([]);
  const [errors, setErrors] = useState<BudgetPriorityFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<MappedBudgetPriorityError | null>(null);
  const [duplicateFinancialYearPeriod, setDuplicateFinancialYearPeriod] = useState<string | undefined>();

  const scrollToFirstError = (nextErrors: BudgetPriorityFormErrors) => {
    const fieldIdMap: Record<string, string> = {
      fullName: 'bpFullName',
      phoneNumber: 'bpPhoneNumber',
      gender: 'bpGender',
      ageGroup: 'bpAgeGroup',
      districtId: 'bpDistrict',
    };
    const firstKey = Object.keys(nextErrors)[0];
    if (!firstKey) return;
    const el = document.getElementById(fieldIdMap[firstKey] ?? firstKey);
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setDuplicateFinancialYearPeriod(undefined);

    const nextErrors = validateBudgetPriorityForm(demographics, rankedAreas);
    setErrors(nextErrors);
    if (hasBudgetPriorityFormErrors(nextErrors)) {
      scrollToFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildBudgetPrioritySubmissionPayload(demographics, rankedAreas);
      const result = await api.submit(section, payload);

      onSubmitted?.(result);
      navigate(BUDGET_PRIORITY_ROUTES.success(section), { state: { result } });
    } catch (error) {
      const financialYearPeriodKey = toFinancialYearPeriodKey(deriveFinancialYearPeriod());
      const mapped = mapBudgetPrioritySubmitError(error, section, { financialYearPeriodKey });
      if (mapped.kind === 'duplicate') {
        setSubmitError(mapped);
        setDuplicateFinancialYearPeriod(financialYearPeriodKey);
        return;
      }

      setSubmitError(mapped);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={budgetPrioritiesClasses.formShell}
      data-testid="budget-priority-form"
      noValidate
    >
      {submitError?.kind === 'duplicate' && (
        <BudgetPriorityDuplicateBlock
          section={section}
          financialYearPeriod={duplicateFinancialYearPeriod}
          message={submitError.message}
        />
      )}

      {submitError && submitError.kind !== 'duplicate' && (
        <BudgetPriorityErrorAlert title={submitError.title} message={submitError.message} />
      )}

      <BudgetPriorityDemographicsSection
        value={demographics}
        onChange={setDemographics}
        errors={errors}
        locationRepository={locationRepository}
      />

      <BudgetPriorityAreasSection
        section={section}
        rankedAreas={rankedAreas}
        onChange={setRankedAreas}
        errors={errors}
      />

      <button
        type="submit"
        disabled={submitting}
        className={budgetPrioritiesClasses.submitButton}
        data-testid="budget-priority-submit-button"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? 'Submitting…' : 'Submit priorities'}
      </button>
    </form>
  );
}
