import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../../core/domain/respondent-fields.model';
import { EMPTY_BYP_FIELDS, type BypFormFields } from '../../../../../core/domain/byp-form.model';
import { buildBypSubmissionPayload, validateBypForm, type BypFormErrors } from '../../../../../core/byp-validation';
import { useAuthStore } from '../../../../../core/store/useAuthStore';
import {
  buildAuthProvenanceSnapshot,
  buildSubmissionProvenance,
  RespondentSection,
} from '../../components/forms';
import { submitSurvey } from '../../../../../core/submission-submit.service';
import { BypFundSection } from './BypFundSection';
import { BypRatingSection } from './BypRatingSection';
import { BypBdsSection } from './BypBdsSection';
import { BypFeedbackSection } from './BypFeedbackSection';
import { useConditionalFields } from '../../../../../core/hooks/useConditionalFields';

export interface BypFormProps {
  onSubmitted?: () => void;
}

export function BypForm({ onSubmitted }: BypFormProps) {
  const user = useAuthStore((state) => state.user);
  const isOnline = useAuthStore((state) => state.isOnline);
  const formRef = useRef<HTMLFormElement>(null);
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);
  const [byp, setByp] = useState(EMPTY_BYP_FIELDS);
  const [errors, setErrors] = useState<BypFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useConditionalFields(
    byp as BypFormFields & Record<string, unknown>,
    (key, value) => setByp((current) => ({ ...current, [key]: value })),
    {
      fundReceiptDurationSpecify:
        byp.fundReceiptDuration === 'MORE_THAN_WEEK_LESS_THAN_MONTH' || byp.fundReceiptDuration === 'MONTHS',
      instalmentPeriodSpecify: byp.instalmentPeriod === 'OTHERS',
    }
  );

  const scrollToFirstError = (nextErrors: BypFormErrors) => {
    const fieldIdMap: Record<string, string> = {
      districtId: 'district',
      subcountyId: 'subcounty',
      parishId: 'parish',
      villageId: 'village',
    };
    const firstKey = Object.keys(nextErrors)[0];
    if (!firstKey) return;
    const el = document.getElementById(fieldIdMap[firstKey] ?? firstKey);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('');
    const nextErrors = validateBypForm({ respondent, byp });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const provenance = buildSubmissionProvenance(buildAuthProvenanceSnapshot(user?.id));
      const payload = buildBypSubmissionPayload({ respondent, byp }, provenance);

      await submitSurvey({
        formType: 'BYP',
        collectorId: provenance.collectorId,
        deviceSubmissionId: provenance.deviceSubmissionId,
        status: 'PENDING',
        retryCount: 0,
        createdAt: new Date().toISOString(),
        payload,
      });

      setSuccessMessage(
        isOnline
          ? 'Submission saved and syncing to the server.'
          : 'Saved locally. Your BYP submission will sync when online.'
      );
      window.setTimeout(() => {
        setRespondent(EMPTY_RESPONDENT_FIELDS);
        setByp(EMPTY_BYP_FIELDS);
        setErrors({});
        onSubmitted?.();
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" data-testid="byp-form" noValidate>
      <header>
        <h3 className="text-sm font-bold text-text">Beneficiary Young Person (BYP) Questionnaire</h3>
        <p className="mt-1 text-xs text-text-muted">Complete all required sections before submitting.</p>
      </header>

      {successMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      <RespondentSection value={respondent} onChange={setRespondent} showExactAge errors={errors} />
      <BypFundSection value={byp} onChange={setByp} errors={errors} />
      <BypRatingSection value={byp} onChange={setByp} errors={errors} />
      <BypBdsSection value={byp} onChange={setByp} errors={errors} />
      <BypFeedbackSection value={byp} onChange={setByp} errors={errors} />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:bg-slate-400"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? 'Saving…' : 'Submit BYP Survey'}
      </button>
    </form>
  );
}
