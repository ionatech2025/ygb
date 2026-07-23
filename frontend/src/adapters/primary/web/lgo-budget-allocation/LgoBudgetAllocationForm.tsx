import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  buildLgoBudgetAllocationSubmissionPayload,
  EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE,
} from '../../../../core/domain/lgo-budget-allocation-form.model';
import {
  hasLgoBudgetAllocationFormErrors,
  validateLgoBudgetAllocationForm,
  type LgoBudgetAllocationFormErrors,
} from '../../../../core/domain/lgo-budget-allocation-validation';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
import { applyDuplicateRespondentError } from '../../../../core/apply-form-submit-error';
import { isDuplicateRespondentMessage } from '../../../../core/duplicate-respondent.error';
import { submitLgoBudgetAllocation } from '../../../../core/lgo-budget-allocation-submit.service';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import {
  buildAuthProvenanceSnapshot,
  buildSubmissionProvenance,
  DuplicateRespondentAlert,
  RespondentSection,
} from '../components/forms';
import { LgoPriorYearAllocationsSection } from './LgoPriorYearAllocationsSection';
import { LgoRationaleSection } from './LgoRationaleSection';
import { LgoRecommendationsSection } from './LgoRecommendationsSection';
import { LgoBudgetAllocationSuccessBanner } from './LgoBudgetAllocationSuccessBanner';

export interface LgoBudgetAllocationFormProps {
  locationRepository?: ILocationRepositoryPort;
  submitAllocation?: typeof submitLgoBudgetAllocation;
  onSubmitted?: () => void;
}

export function LgoBudgetAllocationForm({
  locationRepository,
  submitAllocation = submitLgoBudgetAllocation,
  onSubmitted,
}: LgoBudgetAllocationFormProps) {
  const user = useAuthStore((state) => state.user);
  const isOnline = useAuthStore((state) => state.isOnline);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState(EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE);
  const [errors, setErrors] = useState<LgoBudgetAllocationFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

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
    setShowSuccessBanner(false);

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

      await submitAllocation(payload, provenance.collectorId);

      setShowSuccessBanner(true);
      onSubmitted?.();
      window.setTimeout(() => {
        setFormState(EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE);
        setErrors({});
        setShowSuccessBanner(false);
      }, 1200);
    } catch (error) {
      if (applyDuplicateRespondentError(error, setErrors, scrollToFirstError)) {
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
      className={lgoBudgetAllocationClasses.formShell}
      data-testid="lgo-budget-allocation-form"
      noValidate
    >
      {showSuccessBanner && <LgoBudgetAllocationSuccessBanner isOnline={isOnline} />}

      {isDuplicateRespondentMessage(errors.respondentPhone ?? '') && (
        <DuplicateRespondentAlert message={errors.respondentPhone!} />
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
            Saving…
          </>
        ) : (
          'Submit budget allocation interview'
        )}
      </button>
    </form>
  );
}
