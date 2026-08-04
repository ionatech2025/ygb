import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { fetchPublicActiveFiscalYear } from '../../../../../adapters/secondary/api/fiscal-year-settings-api.adapter';
import {
  createLgoFieldsFromActiveFiscalYear,
  EMPTY_LGO_FIELDS,
} from '../../../../../core/domain/lgo-form.model';
import { isNetworkAuthFailure } from '../../../../../core/domain/auth-network';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../../core/domain/respondent-fields.model';
import { buildLgoSubmissionPayload, validateLgoForm, type LgoFormErrors } from '../../../../../core/lgo-validation';
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
import { LgoFiscalYearSection } from './LgoFiscalYearSection';
import { LgoGovernanceSection } from './LgoGovernanceSection';
import { LgoExplainSection } from './LgoExplainSection';
import { LgoFeedbackSection } from './LgoFeedbackSection';

export interface LgoFormProps {
  onSubmitted?: () => void;
}

function fiscalYearLoadFailureMessage(error: unknown): string {
  if (isNetworkAuthFailure(error)) {
    return 'Unable to load the active fiscal year offline. Connect once while online to download it, then try again.';
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return 'Unable to load the active fiscal year. Try again or contact your administrator.';
}

export function LgoForm({ onSubmitted }: LgoFormProps) {
  const user = useAuthStore((state) => state.user);
  const isOnline = useAuthStore((state) => state.isOnline);
  const formRef = useRef<HTMLFormElement>(null);
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);
  const [lgo, setLgo] = useState(EMPTY_LGO_FIELDS);
  const [errors, setErrors] = useState<LgoFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fiscalYearLoading, setFiscalYearLoading] = useState(true);
  const [fiscalYearLoadError, setFiscalYearLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchPublicActiveFiscalYear()
      .then((setting) => {
        if (cancelled) return;
        setLgo(createLgoFieldsFromActiveFiscalYear(setting));
        setFiscalYearLoadError('');
      })
      .catch((error) => {
        if (cancelled) return;
        setFiscalYearLoadError(fiscalYearLoadFailureMessage(error));
      })
      .finally(() => {
        if (!cancelled) {
          setFiscalYearLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToFirstError = (nextErrors: LgoFormErrors) => {
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

  const resetForm = () => {
    setRespondent(EMPTY_RESPONDENT_FIELDS);
    setErrors({});
    setFiscalYearLoading(true);
    fetchPublicActiveFiscalYear()
      .then((setting) => {
        setLgo(createLgoFieldsFromActiveFiscalYear(setting));
        setFiscalYearLoadError('');
      })
      .catch((error) => {
        setLgo(EMPTY_LGO_FIELDS);
        setFiscalYearLoadError(fiscalYearLoadFailureMessage(error));
      })
      .finally(() => setFiscalYearLoading(false));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('');
    const nextErrors = validateLgoForm({ respondent, lgo });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const provenance = buildSubmissionProvenance(buildAuthProvenanceSnapshot(user?.id));
      const payload = buildLgoSubmissionPayload({ respondent, lgo }, provenance);

      await submitSurvey({
        formType: 'LGO',
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
          : 'Saved locally. Your LGO submission will sync when online.'
      );
      window.setTimeout(() => {
        resetForm();
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" data-testid="lgo-form" noValidate>
      <header>
        <h3 className="text-sm font-bold text-text">Local Government Official (LGO) Questionnaire</h3>
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
      <LgoFiscalYearSection
        value={lgo}
        onChange={setLgo}
        errors={errors}
        loading={fiscalYearLoading}
        loadError={fiscalYearLoadError}
      />
      <LgoGovernanceSection value={lgo} onChange={setLgo} errors={errors} />
      <LgoExplainSection value={lgo} onChange={setLgo} errors={errors} />
      <LgoFeedbackSection value={lgo} onChange={setLgo} errors={errors} />

      <button
        type="submit"
        disabled={submitting || fiscalYearLoading || Boolean(fiscalYearLoadError)}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:bg-slate-400"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? 'Saving…' : 'Submit LGO Survey'}
      </button>
    </form>
  );
}
