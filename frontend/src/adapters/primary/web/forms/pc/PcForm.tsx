import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../../core/domain/respondent-fields.model';
import { EMPTY_PC_FIELDS } from '../../../../../core/domain/pc-form.model';
import { buildPcSubmissionPayload, validatePcForm, type PcFormErrors } from '../../../../../core/pc-validation';
import { useAuthStore } from '../../../../../core/store/useAuthStore';
import {
  buildAuthProvenanceSnapshot,
  buildSubmissionProvenance,
  DuplicateRespondentAlert,
  RespondentSection,
} from '../../components/forms';
import { applyDuplicateRespondentError } from '../../../../../core/apply-form-submit-error';
import { isDuplicateRespondentMessage } from '../../../../../core/duplicate-respondent.error';
import { submitSurvey } from '../../../../../core/submission-submit.service';
import { PcFundsReceiptSection } from './PcFundsReceiptSection';
import { PcAccessSection } from './PcAccessSection';
import { PcPdcSection } from './PcPdcSection';
import { PcMonitoringSection } from './PcMonitoringSection';
import { PcSelfRelianceSection } from './PcSelfRelianceSection';

export interface PcFormProps {
  onSubmitted?: () => void;
}

export function PcForm({ onSubmitted }: PcFormProps) {
  const user = useAuthStore((state) => state.user);
  const isOnline = useAuthStore((state) => state.isOnline);
  const formRef = useRef<HTMLFormElement>(null);
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);
  const [pc, setPc] = useState(EMPTY_PC_FIELDS);
  const [errors, setErrors] = useState<PcFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const scrollToFirstError = (nextErrors: PcFormErrors) => {
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
    const nextErrors = validatePcForm({ respondent, pc });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const provenance = buildSubmissionProvenance(buildAuthProvenanceSnapshot(user?.id));
      const payload = buildPcSubmissionPayload({ respondent, pc }, provenance);

      await submitSurvey({
        formType: 'PC',
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
          : 'Saved locally. Your PC submission will sync when online.'
      );
      window.setTimeout(() => {
        setRespondent(EMPTY_RESPONDENT_FIELDS);
        setPc(EMPTY_PC_FIELDS);
        setErrors({});
        onSubmitted?.();
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" data-testid="pc-form" noValidate>
      <header>
        <h3 className="text-sm font-bold text-text">Parish Chief (PC) Questionnaire</h3>
        <p className="mt-1 text-xs text-text-muted">Complete all required sections before submitting.</p>
      </header>

      {successMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {isDuplicateRespondentMessage(errors.respondentPhone ?? '') && (
        <DuplicateRespondentAlert message={errors.respondentPhone!} />
      )}

      <RespondentSection value={respondent} onChange={setRespondent} errors={errors} />
      <PcFundsReceiptSection value={pc} onChange={setPc} errors={errors} />
      <PcAccessSection value={pc} onChange={setPc} errors={errors} />
      <PcPdcSection value={pc} onChange={setPc} errors={errors} />
      <PcMonitoringSection value={pc} onChange={setPc} errors={errors} />
      <PcSelfRelianceSection value={pc} onChange={setPc} errors={errors} />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:bg-slate-400"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? 'Saving…' : 'Submit PC Survey'}
      </button>
    </form>
  );
}
