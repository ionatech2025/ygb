import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  buildLgoBudgetAllocationSubmissionPayload,
  EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE,
  type LgoBudgetAllocationSubmissionResult,
} from '../../../../core/domain/lgo-budget-allocation-form.model';
import {
  hasLgoBudgetAllocationFormErrors,
  validateLgoBudgetAllocationForm,
  type LgoBudgetAllocationFormErrors,
} from '../../../../core/domain/lgo-budget-allocation-validation';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ILgoBudgetAllocationApiPort } from '../../../../ports/lgo-budget-allocation-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { HttpLgoBudgetAllocationAdapter } from '../../../secondary/api/lgo-budget-allocation-api.adapter';
import {
  buildAuthProvenanceSnapshot,
  buildSubmissionProvenance,
  RespondentSection,
} from '../components/forms';
import { LgoPriorYearAllocationsSection } from './LgoPriorYearAllocationsSection';
import { LgoRationaleSection } from './LgoRationaleSection';
import { LgoRecommendationsSection } from './LgoRecommendationsSection';

export interface LgoBudgetAllocationFormProps {
  api?: ILgoBudgetAllocationApiPort;
  locationRepository?: ILocationRepositoryPort;
  onSubmitted?: (result: LgoBudgetAllocationSubmissionResult) => void;
}

export function LgoBudgetAllocationForm({
  api = new HttpLgoBudgetAllocationAdapter(),
  locationRepository,
  onSubmitted,
}: LgoBudgetAllocationFormProps) {
  const user = useAuthStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState(EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE);
  const [errors, setErrors] = useState<LgoBudgetAllocationFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollToFirstError = (nextErrors: LgoBudgetAllocationFormErrors) => {
    const fieldIdMap: Record<string, string> = {
      districtId: 'district',
      subcountyId: 'subcounty',
      parishId: 'parish',
      villageId: 'village',
      rationale: 'lgoRationale',
      recommendations: 'lgoRecommendations',
    };
    const firstKey = Object.keys(nextErrors)[0];
    if (!firstKey) return;
    const el = document.getElementById(fieldIdMap[firstKey] ?? firstKey);
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage('');

    const nextErrors = validateLgoBudgetAllocationForm(formState);
    setErrors(nextErrors);
    if (hasLgoBudgetAllocationFormErrors(nextErrors)) {
      scrollToFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const provenance = buildSubmissionProvenance(buildAuthProvenanceSnapshot(user?.id));
      const payload = buildLgoBudgetAllocationSubmissionPayload(formState, provenance);
      const result = await api.submit(payload);

      setSuccessMessage('LGO budget allocation recorded successfully.');
      onSubmitted?.(result);
      window.setTimeout(() => {
        setFormState(EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE);
        setErrors({});
      }, 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={lgoBudgetAllocationClasses.formShell}
      data-testid="lgo-budget-allocation-form"
      noValidate
    >
      {successMessage && (
        <p
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          {successMessage}
        </p>
      )}

      {submitError && (
        <p
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
          role="alert"
        >
          {submitError}
        </p>
      )}

      <RespondentSection
        value={formState.respondent}
        onChange={(respondent) => setFormState((current) => ({ ...current, respondent }))}
        errors={errors}
        locationRepository={locationRepository}
      />

      <LgoPriorYearAllocationsSection
        value={formState.priorYearAllocations}
        onChange={(priorYearAllocations) => setFormState((current) => ({ ...current, priorYearAllocations }))}
        errors={errors}
        formError={errors.priorYearAllocations}
      />

      <LgoRationaleSection
        value={formState.rationale}
        onChange={(rationale) => setFormState((current) => ({ ...current, rationale }))}
        error={errors.rationale}
      />

      <LgoRecommendationsSection
        value={formState.recommendations}
        onChange={(recommendations) => setFormState((current) => ({ ...current, recommendations }))}
        error={errors.recommendations}
      />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          'Submit budget allocation interview'
        )}
      </button>
    </form>
  );
}
