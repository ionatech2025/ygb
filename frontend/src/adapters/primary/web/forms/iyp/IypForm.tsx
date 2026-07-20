import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../../core/domain/respondent-fields.model';
import { EMPTY_IYP_FIELDS } from '../../../../../core/domain/iyp-form.model';
import { buildIypSubmissionPayload, validateIypForm, type IypFormErrors } from '../../../../../core/iyp-validation';
import { useAuthStore } from '../../../../../core/store/useAuthStore';
import {
  buildAuthProvenanceSnapshot,
  buildSubmissionProvenance,
  RespondentSection,
} from '../../components/forms';
import { submissionQueue } from '../../../../secondary/submission/submission-queue.adapter';
import { IypAwarenessSection } from './IypAwarenessSection';
import { IypApplicationSection } from './IypApplicationSection';
import { IypBarriersSection } from './IypBarriersSection';
import { IypFeedbackSection } from './IypFeedbackSection';

export interface IypFormProps {
  onSubmitted?: () => void;
}

export function IypForm({ onSubmitted }: IypFormProps) {
  const user = useAuthStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);
  const [iyp, setIyp] = useState(EMPTY_IYP_FIELDS);
  const [errors, setErrors] = useState<IypFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const scrollToFirstError = (nextErrors: IypFormErrors) => {
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
    const nextErrors = validateIypForm({ respondent, iyp });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const provenance = buildSubmissionProvenance(buildAuthProvenanceSnapshot(user?.id));
      const payload = buildIypSubmissionPayload({ respondent, iyp }, provenance);

      await submissionQueue.enqueue({
        formType: 'IYP',
        collectorId: provenance.collectorId,
        deviceSubmissionId: provenance.deviceSubmissionId,
        status: 'PENDING',
        retryCount: 0,
        createdAt: new Date().toISOString(),
        payload,
      });

      setSuccessMessage('Saved locally. Your IYP submission will sync when online.');
      window.setTimeout(() => {
        setRespondent(EMPTY_RESPONDENT_FIELDS);
        setIyp(EMPTY_IYP_FIELDS);
        setErrors({});
        onSubmitted?.();
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" data-testid="iyp-form" noValidate>
      <header>
        <h3 className="text-sm font-bold text-text">Individual Young Person (IYP) Questionnaire</h3>
        <p className="mt-1 text-xs text-text-muted">Complete all required sections before submitting.</p>
      </header>

      {successMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      <RespondentSection value={respondent} onChange={setRespondent} errors={errors} />
      <IypAwarenessSection value={iyp} onChange={setIyp} errors={errors} />
      <IypApplicationSection value={iyp} onChange={setIyp} errors={errors} />
      <IypBarriersSection value={iyp} onChange={setIyp} errors={errors} />
      <IypFeedbackSection value={iyp} onChange={setIyp} errors={errors} />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:bg-slate-400"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? 'Saving…' : 'Submit IYP Survey'}
      </button>
    </form>
  );
}
