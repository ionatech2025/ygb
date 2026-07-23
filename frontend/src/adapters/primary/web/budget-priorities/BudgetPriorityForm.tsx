import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { BudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
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
import type { IBudgetPriorityApiPort } from '../../../../ports/budget-priority-api.port';
import { HttpBudgetPriorityAdapter, ApiError } from '../../../secondary/api/budget-priority-api.adapter';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { BudgetPriorityDemographicsSection } from './BudgetPriorityDemographicsSection';
import { BudgetPriorityAreasSection } from './BudgetPriorityAreasSection';

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
  const formRef = useRef<HTMLFormElement>(null);
  const [demographics, setDemographics] = useState(EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS);
  const [rankedAreas, setRankedAreas] = useState<string[]>([]);
  const [errors, setErrors] = useState<BudgetPriorityFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

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

      setSuccessMessage('Thank you — your budget priorities have been submitted.');
      setDemographics(EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS);
      setRankedAreas([]);
      setErrors({});
      onSubmitted?.(result);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors({
          phoneNumber: 'A submission from this phone number already exists for this sector.',
        });
        scrollToFirstError({ phoneNumber: 'duplicate' });
        return;
      }
      if (error instanceof ApiError) {
        setErrors({ rankedAreas: error.message || 'Submission failed. Please try again.' });
        return;
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5"
      data-testid="budget-priority-form"
      noValidate
    >
      {successMessage && (
        <div
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
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
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:bg-slate-400"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? 'Submitting…' : 'Submit priorities'}
      </button>
    </form>
  );
}
